#!/usr/bin/env python3
"""
CropHealth AI - TFLite Export Script
Authors: Rohan Priyadarshan & Saket Kumawat

Usage:
    python export_tflite.py --model models/saved/ensemble_v1.h5 --output models/tflite/crop_disease_lite.tflite
"""

import argparse
import os
import tensorflow as tf
from datetime import datetime


def export_to_tflite(
    model_path: str,
    output_path: str,
    quantization: str = "float16",
    optimize: bool = True
):
    """
    Export Keras model to TensorFlow Lite format
    
    Args:
        model_path: Path to saved Keras model
        output_path: Output path for TFLite model
        quantization: Quantization type ('none', 'float16', 'int8')
        optimize: Whether to apply default optimizations
    """
    
    print(f"\n{'='*60}")
    print("CropHealth AI - TFLite Export")
    print(f"{'='*60}\n")
    
    # Load Keras model
    print(f"Loading model from: {model_path}")
    model = tf.keras.models.load_model(model_path)
    
    # Get model info
    input_shape = model.input_shape[1:]
    output_shape = model.output_shape[1:]
    print(f"Input shape: {input_shape}")
    print(f"Output shape: {output_shape}")
    
    # Create converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Apply optimizations
    if optimize:
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        print("Applied default optimizations")
    
    # Apply quantization
    if quantization == "float16":
        converter.target_spec.supported_types = [tf.float16]
        print("Applied float16 quantization")
    elif quantization == "int8":
        converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
        converter.inference_input_type = tf.int8
        converter.inference_output_type = tf.int8
        print("Applied int8 quantization")
    
    # Convert
    print("\nConverting model...")
    tflite_model = converter.convert()
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    # Get file sizes
    original_size = os.path.getsize(model_path) / (1024 * 1024)
    tflite_size = os.path.getsize(output_path) / (1024 * 1024)
    reduction = (1 - tflite_size / original_size) * 100
    
    print(f"\n--- Export Summary ---")
    print(f"Original model size: {original_size:.2f} MB")
    print(f"TFLite model size:   {tflite_size:.2f} MB")
    print(f"Size reduction:      {reduction:.1f}%")
    print(f"\nSaved to: {output_path}")
    
    # Verify model
    print("\nVerifying TFLite model...")
    interpreter = tf.lite.Interpreter(model_path=output_path)
    interpreter.allocate_tensors()
    
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    print(f"Input details: {input_details[0]['shape']}")
    print(f"Output details: {output_details[0]['shape']}")
    print("\n✓ TFLite model verified successfully!")
    
    return output_path


def main():
    parser = argparse.ArgumentParser(description='CropHealth AI - TFLite Export')
    parser.add_argument('--model', type=str, required=True,
                        help='Path to Keras model (.h5)')
    parser.add_argument('--output', type=str, required=True,
                        help='Output path for TFLite model')
    parser.add_argument('--quantization', type=str, default='float16',
                        choices=['none', 'float16', 'int8'],
                        help='Quantization type')
    parser.add_argument('--no-optimize', action='store_true',
                        help='Disable default optimizations')
    
    args = parser.parse_args()
    
    export_to_tflite(
        model_path=args.model,
        output_path=args.output,
        quantization=args.quantization,
        optimize=not args.no_optimize
    )


if __name__ == '__main__':
    main()
