# CropHealth AI - API Documentation

## Base URL
```
https://api.crophealth.ai/v1
```

## Authentication
All API requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Endpoints

### 1. Disease Prediction

#### POST `/predict`
Analyze a crop image for disease detection.

**Request:**
```json
{
  "image": "base64_encoded_image_string",
  "crop_type": "tomato",
  "return_gradcam": true
}
```

**Response:**
```json
{
  "prediction_id": "PRED_20241204_001",
  "primary_disease": "Early Blight",
  "confidence": 0.94,
  "crop": "Tomato",
  "top_alternatives": [
    {"disease": "Late Blight", "confidence": 0.03},
    {"disease": "Healthy", "confidence": 0.02}
  ],
  "treatment_recommendations": [
    "Apply copper-based fungicide",
    "Remove infected leaves",
    "Improve air circulation"
  ],
  "gradcam_heatmap": "base64_encoded_heatmap"
}
```

---

### 2. User Management

#### POST `/users/register`
Register a new user.

**Request:**
```json
{
  "name": "John Farmer",
  "email": "john@farm.com",
  "phone": "+1234567890",
  "farm_location": "California, USA",
  "crop_type": "Tomato",
  "expertise_level": 3
}
```

#### GET `/users/{user_id}`
Get user profile information.

#### PUT `/users/{user_id}`
Update user profile.

---

### 3. Prediction History

#### GET `/predictions`
Get user's prediction history.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number (default: 1) |
| limit | int | Results per page (default: 20) |
| crop | string | Filter by crop type |
| start_date | string | Filter from date (YYYY-MM-DD) |
| end_date | string | Filter to date (YYYY-MM-DD) |

#### GET `/predictions/{prediction_id}`
Get detailed prediction result.

---

### 4. Disease Information

#### GET `/diseases`
List all supported diseases.

**Response:**
```json
{
  "total": 38,
  "diseases": [
    {
      "disease_id": "TOM_EB",
      "name": "Early Blight",
      "crop": "Tomato",
      "description": "Fungal disease caused by Alternaria solani",
      "symptoms": ["Dark spots with concentric rings", "Yellowing leaves"],
      "severity_levels": ["Low", "Medium", "High"]
    }
  ]
}
```

#### GET `/diseases/{disease_id}`
Get detailed disease information.

---

### 5. Model Analytics

#### GET `/analytics/models`
Get model performance metrics.

**Response:**
```json
{
  "models": [
    {
      "model_id": "MOD_001",
      "name": "ResNet50-CropHealth",
      "architecture": "ResNet50",
      "accuracy": 0.9645,
      "precision": 0.9589,
      "recall": 0.9612,
      "f1_score": 0.9600,
      "inference_time_ms": 45
    }
  ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 413 | Payload Too Large - Image exceeds 10MB |
| 422 | Unprocessable - Image quality too low |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limits

| Plan | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 10 | 50 |
| Pro | 100 | 1000 |
| Enterprise | Unlimited | Unlimited |

---

## Credits
**Developed by:** Rohan Priyadarshan & Saket Kumawat
