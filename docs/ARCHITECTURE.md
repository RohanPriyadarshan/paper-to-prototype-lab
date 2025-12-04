# CropHealth AI - System Architecture

## Overview

CropHealth AI is a full-stack machine learning application for crop disease prediction using deep learning models trained on the PlantVillage and PlantDoc datasets.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Web App    │  │  Mobile App  │  │   REST API   │  │   Webhooks   │    │
│  │   (React)    │  │  (TF Lite)   │  │   Clients    │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────────┘
          │                 │                 │                 │
          └─────────────────┴────────┬────────┴─────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                           API GATEWAY LAYER                                  │
├────────────────────────────────────┼────────────────────────────────────────┤
│                    ┌───────────────▼───────────────┐                        │
│                    │         NGINX Proxy           │                        │
│                    │    (Load Balancing, SSL)      │                        │
│                    └───────────────┬───────────────┘                        │
│                                    │                                        │
│         ┌──────────────────────────┼──────────────────────────┐            │
│         │                          │                          │            │
│  ┌──────▼──────┐           ┌───────▼───────┐          ┌───────▼───────┐    │
│  │    Auth     │           │   Rate        │          │   Request     │    │
│  │  Middleware │           │   Limiter     │          │   Validator   │    │
│  └─────────────┘           └───────────────┘          └───────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                          APPLICATION LAYER                                   │
├────────────────────────────────────┼────────────────────────────────────────┤
│                    ┌───────────────▼───────────────┐                        │
│                    │     FastAPI Application       │                        │
│                    └───────────────┬───────────────┘                        │
│                                    │                                        │
│    ┌───────────────┬───────────────┼───────────────┬───────────────┐       │
│    │               │               │               │               │       │
│ ┌──▼───┐      ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐  ┌──────▼──┐   │
│ │ User │      │Prediction│    │  Disease  │   │ Analytics │  │ Storage │   │
│ │Routes│      │  Routes  │    │  Routes   │   │  Routes   │  │ Routes  │   │
│ └──────┘      └──────────┘    └───────────┘   └───────────┘  └─────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                           ML INFERENCE LAYER                                 │
├────────────────────────────────────┼────────────────────────────────────────┤
│                    ┌───────────────▼───────────────┐                        │
│                    │    Prediction Service         │                        │
│                    └───────────────┬───────────────┘                        │
│                                    │                                        │
│  ┌─────────────┐  ┌────────────────┼────────────────┐  ┌─────────────┐     │
│  │   Image     │  │                │                │  │   GradCAM   │     │
│  │Preprocessor │  │    ┌───────────▼───────────┐   │  │  Generator  │     │
│  │             │  │    │   Ensemble Classifier  │   │  │             │     │
│  │ - Resize    │  │    └───────────┬───────────┘   │  │ - Attention │     │
│  │ - Normalize │  │                │               │  │ - Heatmaps  │     │
│  │ - Augment   │  │    ┌───────────┼───────────┐   │  └─────────────┘     │
│  └─────────────┘  │    │           │           │   │                      │
│                   │ ┌──▼──┐    ┌───▼───┐   ┌───▼──┐│                      │
│                   │ │Res  │    │Dense  │   │ViT   ││                      │
│                   │ │Net50│    │Net121 │   │      ││                      │
│                   │ └─────┘    └───────┘   └──────┘│                      │
│                   └────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                            DATA LAYER                                        │
├────────────────────────────────────┼────────────────────────────────────────┤
│         ┌──────────────────────────┼──────────────────────────┐            │
│         │                          │                          │            │
│  ┌──────▼──────┐           ┌───────▼───────┐          ┌───────▼───────┐    │
│  │  PostgreSQL │           │    Redis      │          │  File Storage │    │
│  │  Database   │           │    Cache      │          │    (S3)       │    │
│  │             │           │               │          │               │    │
│  │ - Users     │           │ - Sessions    │          │ - Images      │    │
│  │ - Predictions│          │ - Model Cache │          │ - Models      │    │
│  │ - Diseases  │           │ - Rate Limits │          │ - Exports     │    │
│  │ - Analytics │           │               │          │               │    │
│  └─────────────┘           └───────────────┘          └───────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Description

### 1. Client Layer
- **Web App**: React + TypeScript SPA with image upload and results display
- **Mobile App**: TensorFlow Lite integration for offline predictions
- **REST API**: For third-party integrations

### 2. API Gateway Layer
- **NGINX**: Reverse proxy, load balancing, SSL termination
- **Auth Middleware**: JWT token validation
- **Rate Limiter**: Request throttling per user/IP

### 3. Application Layer
- **FastAPI**: High-performance Python web framework
- **Route Modules**: Separated by domain (users, predictions, diseases)

### 4. ML Inference Layer
- **Image Preprocessor**: Resize, normalize, augment images
- **Ensemble Classifier**: Combines multiple model predictions
- **Base Models**: ResNet50, DenseNet121, Vision Transformer
- **GradCAM**: Explainable AI attention visualization

### 5. Data Layer
- **PostgreSQL**: Primary database for structured data
- **Redis**: Caching layer for sessions and model outputs
- **S3 Storage**: Image and model file storage

---

## Data Flow

1. User uploads image via web/mobile app
2. Request passes through NGINX → Auth → Rate Limiter
3. FastAPI receives request, validates input
4. Image sent to preprocessing pipeline
5. Preprocessed image fed to ensemble classifier
6. Each model (ResNet50, DenseNet121, ViT) generates predictions
7. Ensemble combines predictions using weighted voting
8. GradCAM generates attention heatmap
9. Results stored in PostgreSQL
10. Response returned to client

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | Python 3.8+, FastAPI, SQLAlchemy |
| ML Framework | TensorFlow/Keras, PyTorch |
| Database | PostgreSQL 14+ |
| Cache | Redis 7+ |
| Storage | AWS S3 / MinIO |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## Credits
**Developed by:** Rohan Priyadarshan & Saket Kumawat
