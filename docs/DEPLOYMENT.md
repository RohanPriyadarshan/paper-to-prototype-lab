# CropHealth AI - Deployment Guide

## Overview

This guide covers deploying CropHealth AI to production environments.

---

## 1. Prerequisites

- Docker & Docker Compose
- Python 3.8+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- NVIDIA GPU (optional, for faster inference)

---

## 2. Environment Configuration

### Create `.env` file
```env
# Application
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crophealth
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379/0

# ML Models
MODEL_PATH=/app/models/saved
ENSEMBLE_WEIGHTS=0.30,0.35,0.15,0.20

# Storage
S3_BUCKET=crophealth-images
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# API
API_RATE_LIMIT=100
API_TIMEOUT=30

# Frontend
VITE_API_URL=https://api.crophealth.ai
```

---

## 3. Docker Deployment

### docker-compose.yml
```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://crophealth:password@postgres:5432/crophealth
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./ml/models:/app/models:ro
      - uploads:/app/uploads

  # ML Inference Service
  ml-service:
    build:
      context: ./ml
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - MODEL_PATH=/app/models
    volumes:
      - ./ml/models:/app/models:ro
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=crophealth
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=crophealth
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # NGINX Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
  uploads:
```

### Deploy Commands
```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d

# View logs
docker-compose logs -f backend

# Scale ML service
docker-compose up -d --scale ml-service=3

# Stop all services
docker-compose down
```

---

## 4. Database Migration

```bash
# Run migrations
docker-compose exec backend python -m alembic upgrade head

# Seed initial data
docker-compose exec backend python scripts/seed_database.py

# Backup database
docker-compose exec postgres pg_dump -U crophealth crophealth > backup.sql
```

---

## 5. NGINX Configuration

### nginx.conf
```nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name crophealth.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crophealth.ai;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
        client_max_body_size 10M;
    }

    # Health check
    location /health {
        proxy_pass http://backend/health;
    }
}
```

---

## 6. Health Checks

### API Health Endpoint
```bash
curl https://api.crophealth.ai/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "models_loaded": true,
  "version": "1.0.0"
}
```

---

## 7. Monitoring

### Prometheus Metrics
- `crophealth_predictions_total` - Total predictions made
- `crophealth_prediction_latency_seconds` - Prediction latency histogram
- `crophealth_model_accuracy` - Model accuracy gauge
- `crophealth_api_requests_total` - Total API requests

### Grafana Dashboards
Import dashboards from `docker/grafana/dashboards/`

---

## 8. Scaling Considerations

| Component | Scaling Strategy |
|-----------|------------------|
| Frontend | Horizontal (CDN + multiple instances) |
| Backend API | Horizontal (load balanced) |
| ML Service | Vertical (GPU) + Horizontal |
| PostgreSQL | Vertical + Read replicas |
| Redis | Cluster mode |

---

## 9. Backup Strategy

```bash
# Daily database backup
0 2 * * * docker-compose exec -T postgres pg_dump -U crophealth crophealth | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Weekly model backup
0 3 * * 0 tar -czf /backups/models_$(date +\%Y\%m\%d).tar.gz ./ml/models/
```

---

## Credits
**Developed by:** Rohan Priyadarshan & Saket Kumawat
