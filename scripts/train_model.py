#!/usr/bin/env python3
"""
CropHealth AI - Model Training Script
Authors: Rohan Priyadarshan & Saket Kumawat

Usage:
    python train_model.py --model resnet50 --epochs 50 --batch_size 32
    python train_model.py --model all --epochs 50
    python train_model.py --model densenet121 --fine_tune --weights models/saved/densenet121_v1.h5
"""

import argparse
import os
import yaml
import numpy as np
from datetime import datetime

# TensorFlow imports
import tensorflow as tf
from tensorflow.keras.applications import ResNet50, DenseNet121, InceptionV3
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import (
    EarlyStopping, 
    ModelCheckpoint, 
    ReduceLROnPlateau,
    TensorBoard
)
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.utils.class_weight import compute_class_weight


def load_config(config_path: str = "ml/config/model_config.yaml") -> dict:
    """Load configuration from YAML file"""
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)


def create_data_generators(config: dict, model_name: str):
    """Create training and validation data generators"""
    
    input_size = config['models'][model_name]['input_size']
    batch_size = config['training']['batch_size']
    norm = config['preprocessing']['normalization']
    
    # Training generator with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.8, 1.2],
        zoom_range=0.2,
        preprocessing_function=lambda x: (x - norm['mean']) / norm['std']
    )
    
    # Validation generator (no augmentation)
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        preprocessing_function=lambda x: (x - norm['mean']) / norm['std']
    )
    
    train_generator = train_datagen.flow_from_directory(
        os.path.join(config['data']['processed_path'], 'train'),
        target_size=(input_size, input_size),
        batch_size=batch_size,
        class_mode='categorical'
    )
    
    val_generator = val_datagen.flow_from_directory(
        os.path.join(config['data']['processed_path'], 'val'),
        target_size=(input_size, input_size),
        batch_size=batch_size,
        class_mode='categorical'
    )
    
    return train_generator, val_generator


def build_model(model_name: str, config: dict, num_classes: int = 38):
    """Build transfer learning model"""
    
    model_config = config['models'][model_name]
    input_size = model_config['input_size']
    
    # Select base model
    if model_name == 'resnet50':
        base_model = ResNet50(
            weights='imagenet',
            include_top=False,
            input_shape=(input_size, input_size, 3)
        )
    elif model_name == 'densenet121':
        base_model = DenseNet121(
            weights='imagenet',
            include_top=False,
            input_shape=(input_size, input_size, 3)
        )
    elif model_name == 'inceptionv3':
        base_model = InceptionV3(
            weights='imagenet',
            include_top=False,
            input_shape=(input_size, input_size, 3)
        )
    else:
        raise ValueError(f"Unknown model: {model_name}")
    
    # Freeze base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Add classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(
        model_config['dense_units'],
        activation='relu',
        kernel_regularizer=l2(model_config['l2_regularization'])
    )(x)
    x = Dropout(model_config['dropout_rate'])(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    return model, base_model


def get_callbacks(config: dict, model_name: str):
    """Create training callbacks"""
    
    cb_config = config['training']['callbacks']
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    callbacks = [
        EarlyStopping(
            patience=cb_config['early_stopping']['patience'],
            restore_best_weights=cb_config['early_stopping']['restore_best_weights'],
            monitor=cb_config['early_stopping']['monitor'],
            verbose=1
        ),
        ModelCheckpoint(
            f"ml/models/checkpoints/{model_name}_{timestamp}_best.h5",
            save_best_only=cb_config['model_checkpoint']['save_best_only'],
            monitor=cb_config['model_checkpoint']['monitor'],
            verbose=1
        ),
        ReduceLROnPlateau(
            factor=cb_config['reduce_lr']['factor'],
            patience=cb_config['reduce_lr']['patience'],
            min_lr=cb_config['reduce_lr']['min_lr'],
            verbose=1
        ),
        TensorBoard(
            log_dir=f"logs/tensorboard/{model_name}_{timestamp}",
            histogram_freq=1
        )
    ]
    
    return callbacks


def train_model(model_name: str, config: dict, fine_tune: bool = False, weights_path: str = None):
    """Main training function"""
    
    print(f"\n{'='*60}")
    print(f"Training {model_name.upper()}")
    print(f"{'='*60}\n")
    
    # Create data generators
    train_gen, val_gen = create_data_generators(config, model_name)
    
    # Build or load model
    model, base_model = build_model(model_name, config, config['data']['num_classes'])
    
    if weights_path and os.path.exists(weights_path):
        print(f"Loading weights from: {weights_path}")
        model.load_weights(weights_path)
    
    # Calculate class weights
    class_weights = None
    if config['training']['use_class_weights']:
        class_weights = compute_class_weight(
            'balanced',
            classes=np.unique(train_gen.classes),
            y=train_gen.classes
        )
        class_weights = dict(enumerate(class_weights))
    
    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=config['training']['optimizer']['initial_learning_rate']),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Get callbacks
    callbacks = get_callbacks(config, model_name)
    
    # Phase 1: Train classification head
    print("\n--- Phase 1: Training Classification Head ---\n")
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=config['training']['epochs'],
        class_weight=class_weights,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tuning (if enabled)
    if fine_tune:
        print("\n--- Phase 2: Fine-Tuning ---\n")
        
        # Unfreeze last N layers
        fine_tune_layers = config['training']['fine_tune_layers']
        for layer in base_model.layers[-fine_tune_layers:]:
            layer.trainable = True
        
        # Recompile with lower learning rate
        model.compile(
            optimizer=Adam(learning_rate=config['training']['optimizer']['fine_tune_learning_rate']),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Continue training
        history_fine = model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=config['training']['fine_tune_epochs'],
            class_weight=class_weights,
            callbacks=callbacks,
            verbose=1
        )
    
    # Save final model
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    save_path = f"ml/models/saved/{model_name}_{timestamp}.h5"
    model.save(save_path)
    print(f"\nModel saved to: {save_path}")
    
    return model, history


def main():
    parser = argparse.ArgumentParser(description='CropHealth AI - Model Training')
    parser.add_argument('--model', type=str, required=True,
                        choices=['resnet50', 'densenet121', 'inceptionv3', 'vit', 'all'],
                        help='Model architecture to train')
    parser.add_argument('--epochs', type=int, default=50,
                        help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=32,
                        help='Training batch size')
    parser.add_argument('--fine_tune', action='store_true',
                        help='Enable fine-tuning phase')
    parser.add_argument('--weights', type=str, default=None,
                        help='Path to pre-trained weights')
    parser.add_argument('--config', type=str, default='ml/config/model_config.yaml',
                        help='Path to configuration file')
    
    args = parser.parse_args()
    
    # Load configuration
    config = load_config(args.config)
    
    # Override config with command line args
    config['training']['epochs'] = args.epochs
    config['training']['batch_size'] = args.batch_size
    
    # Create directories
    os.makedirs('ml/models/saved', exist_ok=True)
    os.makedirs('ml/models/checkpoints', exist_ok=True)
    os.makedirs('logs/tensorboard', exist_ok=True)
    
    # Train model(s)
    if args.model == 'all':
        models = ['resnet50', 'densenet121', 'inceptionv3']
        for model_name in models:
            train_model(model_name, config, args.fine_tune, args.weights)
    else:
        train_model(args.model, config, args.fine_tune, args.weights)
    
    print("\n✓ Training complete!")


if __name__ == '__main__':
    main()
