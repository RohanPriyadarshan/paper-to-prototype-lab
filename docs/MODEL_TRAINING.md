# CropHealth AI - Model Training Guide

## Overview

This guide covers the complete machine learning pipeline for training crop disease classification models.

---

## 1. Dataset Preparation

### Source Datasets
- **PlantVillage**: 54,305 images across 38 classes
- **PlantDoc**: 2,598 images with real-world conditions

### Directory Structure
```
data/
├── raw/
│   ├── PlantVillage/
│   │   ├── Tomato_Early_blight/
│   │   ├── Tomato_Late_blight/
│   │   └── ...
│   └── PlantDoc/
├── processed/
│   ├── train/
│   ├── val/
│   └── test/
└── augmented/
```

### Data Split
| Set | Percentage | Purpose |
|-----|------------|---------|
| Training | 70% | Model learning |
| Validation | 15% | Hyperparameter tuning |
| Test | 15% | Final evaluation |

---

## 2. Image Preprocessing Pipeline

### Algorithm
```python
def preprocess_image(image_path, target_size=224, augment=False):
    """
    Comprehensive image preprocessing pipeline
    
    Args:
        image_path: Path to disease image file
        target_size: Standard size (224 or 299)
        augment: Apply augmentation for training
    
    Returns:
        Preprocessed image tensor
    """
    # Load and validate image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Cannot load image: {image_path}")
    
    # Validate minimum resolution
    height, width = image.shape[:2]
    if min(height, width) < 224:
        raise ValueError(f"Image too small: {width}x{height}")
    
    # Convert BGR to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Apply transformations
    if augment:
        transform = Compose([
            Resize(target_size, target_size),
            HorizontalFlip(p=0.5),
            VerticalFlip(p=0.3),
            Rotate(limit=20, p=0.5),
            RandomBrightnessContrast(p=0.3),
            Normalize(mean=[0.485, 0.456, 0.406],
                     std=[0.229, 0.224, 0.225]),
        ])
    else:
        transform = Compose([
            Resize(target_size, target_size),
            Normalize(mean=[0.485, 0.456, 0.406],
                     std=[0.229, 0.224, 0.225]),
        ])
    
    return transform(image=image)['image']
```

### ImageNet Normalization Constants
```python
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
```

---

## 3. Model Architectures

### 3.1 ResNet50
- **Parameters**: 25.6M
- **Input Size**: 224×224
- **Accuracy**: 96.45%
- **Inference Time**: 45ms

### 3.2 DenseNet121
- **Parameters**: 8M
- **Input Size**: 224×224
- **Accuracy**: 97.12%
- **Inference Time**: 52ms

### 3.3 InceptionV3
- **Parameters**: 23.9M
- **Input Size**: 299×299
- **Accuracy**: 95.34%
- **Inference Time**: 68ms

### 3.4 Vision Transformer (ViT)
- **Parameters**: 86M
- **Input Size**: 224×224
- **Accuracy**: 98.01%
- **Inference Time**: 95ms

---

## 4. Transfer Learning Process

### Algorithm
```python
def train_transfer_learning_model(model_name, train_data, val_data):
    """
    Transfer learning training pipeline
    """
    # Step 1: Load pre-trained model
    if model_name == 'resnet50':
        base_model = ResNet50(weights='imagenet', include_top=False)
        input_size = 224
    elif model_name == 'densenet121':
        base_model = DenseNet121(weights='imagenet', include_top=False)
        input_size = 224
    elif model_name == 'inceptionv3':
        base_model = InceptionV3(weights='imagenet', include_top=False)
        input_size = 299
    
    # Step 2: Freeze base layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Step 3: Add classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu', 
              kernel_regularizer=l2(1e-4))(x)
    x = Dropout(0.5)(x)
    predictions = Dense(38, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Step 4: Compile with optimizer
    model.compile(
        optimizer=Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Step 5: Calculate class weights for imbalanced data
    class_weights = compute_class_weight(
        'balanced',
        classes=np.unique(train_labels),
        y=train_labels
    )
    
    # Step 6: Train with callbacks
    callbacks = [
        EarlyStopping(patience=10, restore_best_weights=True),
        ModelCheckpoint('best_model.h5', save_best_only=True),
        ReduceLROnPlateau(factor=0.5, patience=5)
    ]
    
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=50,
        class_weight=dict(enumerate(class_weights)),
        callbacks=callbacks
    )
    
    # Step 7: Fine-tuning phase
    for layer in base_model.layers[-30:]:
        layer.trainable = True
    
    model.compile(
        optimizer=Adam(learning_rate=5e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    model.fit(
        train_data,
        validation_data=val_data,
        epochs=20,
        callbacks=callbacks
    )
    
    return model
```

---

## 5. Ensemble Classification

### Weighted Voting Algorithm
```python
def ensemble_predict(image, models, weights):
    """
    Ensemble prediction using weighted voting
    
    Args:
        image: Preprocessed image tensor
        models: List of trained models
        weights: List of model weights
    
    Returns:
        Final prediction with confidence
    """
    predictions = []
    
    # Get predictions from each model
    for model in models:
        pred = model.predict(np.expand_dims(image, axis=0))
        predictions.append(pred[0])
    
    # Weighted average
    weighted_pred = np.zeros(38)
    for pred, weight in zip(predictions, weights):
        weighted_pred += pred * weight
    
    weighted_pred /= sum(weights)
    
    # Get top predictions
    top_indices = np.argsort(weighted_pred)[::-1][:5]
    
    return {
        'primary_class': top_indices[0],
        'primary_confidence': weighted_pred[top_indices[0]],
        'alternatives': [
            {'class': idx, 'confidence': weighted_pred[idx]}
            for idx in top_indices[1:5]
        ]
    }
```

### Ensemble Weights
| Model | Weight |
|-------|--------|
| ResNet50 | 0.30 |
| DenseNet121 | 0.35 |
| InceptionV3 | 0.15 |
| ViT | 0.20 |

---

## 6. Training Commands

### Start Training
```bash
# Train individual model
python scripts/train_model.py --model resnet50 --epochs 50 --batch_size 32

# Train all models
python scripts/train_model.py --model all --epochs 50

# Fine-tune existing model
python scripts/train_model.py --model densenet121 --fine_tune --weights models/saved/densenet121_v1.h5
```

### Evaluate Model
```bash
# Evaluate on test set
python scripts/evaluate_model.py --model models/saved/ensemble_v1.h5 --test_dir data/processed/test

# Generate confusion matrix
python scripts/evaluate_model.py --model models/saved/resnet50_v1.h5 --confusion_matrix
```

### Export to TFLite
```bash
# Export for mobile deployment
python scripts/export_tflite.py --model models/saved/ensemble_v1.h5 --output models/tflite/crop_disease_lite.tflite
```

---

## 7. Performance Metrics

| Metric | ResNet50 | DenseNet121 | InceptionV3 | ViT | Ensemble |
|--------|----------|-------------|-------------|-----|----------|
| Accuracy | 96.45% | 97.12% | 95.34% | 98.01% | **98.56%** |
| Precision | 95.89% | 96.78% | 94.98% | 97.56% | **98.23%** |
| Recall | 96.12% | 96.95% | 95.21% | 97.78% | **98.41%** |
| F1-Score | 96.00% | 96.86% | 95.09% | 97.67% | **98.32%** |

---

## Credits
**Developed by:** Rohan Priyadarshan & Saket Kumawat
