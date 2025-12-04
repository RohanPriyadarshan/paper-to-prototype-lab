#!/usr/bin/env python3
"""
CropHealth AI - Model Evaluation Script
Authors: Rohan Priyadarshan & Saket Kumawat

Usage:
    python evaluate_model.py --model models/saved/ensemble_v1.h5 --test_dir data/processed/test
    python evaluate_model.py --model models/saved/resnet50_v1.h5 --confusion_matrix
"""

import argparse
import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)


def load_disease_classes(path: str = "ml/config/disease_classes.json") -> dict:
    """Load disease class mappings"""
    with open(path, 'r') as f:
        return json.load(f)


def create_test_generator(test_dir: str, input_size: int = 224, batch_size: int = 32):
    """Create test data generator"""
    
    test_datagen = ImageDataGenerator(
        rescale=1./255,
        preprocessing_function=lambda x: (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    )
    
    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(input_size, input_size),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    
    return test_generator


def evaluate_model(model_path: str, test_dir: str, generate_confusion: bool = False):
    """Evaluate model on test set"""
    
    print(f"\n{'='*60}")
    print("CropHealth AI - Model Evaluation")
    print(f"{'='*60}\n")
    
    # Load model
    print(f"Loading model from: {model_path}")
    model = load_model(model_path)
    
    # Determine input size from model
    input_size = model.input_shape[1]
    print(f"Input size: {input_size}x{input_size}")
    
    # Create test generator
    test_gen = create_test_generator(test_dir, input_size)
    num_samples = test_gen.samples
    num_classes = test_gen.num_classes
    
    print(f"Test samples: {num_samples}")
    print(f"Number of classes: {num_classes}\n")
    
    # Get predictions
    print("Running inference...")
    predictions = model.predict(test_gen, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_gen.classes
    
    # Calculate metrics
    print("\n--- Evaluation Metrics ---\n")
    
    accuracy = accuracy_score(true_classes, predicted_classes)
    precision = precision_score(true_classes, predicted_classes, average='weighted')
    recall = recall_score(true_classes, predicted_classes, average='weighted')
    f1 = f1_score(true_classes, predicted_classes, average='weighted')
    
    print(f"Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Precision: {precision:.4f} ({precision*100:.2f}%)")
    print(f"Recall:    {recall:.4f} ({recall*100:.2f}%)")
    print(f"F1-Score:  {f1:.4f} ({f1*100:.2f}%)")
    
    # Per-class metrics
    print("\n--- Per-Class Classification Report ---\n")
    
    disease_classes = load_disease_classes()
    class_names = [c['name'] for c in disease_classes['classes']]
    
    report = classification_report(
        true_classes,
        predicted_classes,
        target_names=class_names[:num_classes],
        digits=4
    )
    print(report)
    
    # Generate confusion matrix
    if generate_confusion:
        print("\nGenerating confusion matrix...")
        
        cm = confusion_matrix(true_classes, predicted_classes)
        
        plt.figure(figsize=(20, 16))
        sns.heatmap(
            cm,
            annot=True,
            fmt='d',
            cmap='Blues',
            xticklabels=class_names[:num_classes],
            yticklabels=class_names[:num_classes]
        )
        plt.title('Confusion Matrix - CropHealth AI', fontsize=16)
        plt.xlabel('Predicted', fontsize=12)
        plt.ylabel('Actual', fontsize=12)
        plt.xticks(rotation=45, ha='right', fontsize=8)
        plt.yticks(fontsize=8)
        plt.tight_layout()
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = f"logs/confusion_matrix_{timestamp}.png"
        plt.savefig(save_path, dpi=150)
        print(f"Confusion matrix saved to: {save_path}")
    
    # Save evaluation results
    results = {
        "model_path": model_path,
        "test_samples": num_samples,
        "num_classes": num_classes,
        "metrics": {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1)
        },
        "timestamp": datetime.now().isoformat()
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_path = f"logs/evaluation_results_{timestamp}.json"
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {results_path}")
    
    return results


def main():
    parser = argparse.ArgumentParser(description='CropHealth AI - Model Evaluation')
    parser.add_argument('--model', type=str, required=True,
                        help='Path to trained model')
    parser.add_argument('--test_dir', type=str, default='data/processed/test',
                        help='Path to test data directory')
    parser.add_argument('--confusion_matrix', action='store_true',
                        help='Generate confusion matrix visualization')
    
    args = parser.parse_args()
    
    # Create logs directory
    os.makedirs('logs', exist_ok=True)
    
    # Run evaluation
    evaluate_model(args.model, args.test_dir, args.confusion_matrix)
    
    print("\n✓ Evaluation complete!")


if __name__ == '__main__':
    main()
