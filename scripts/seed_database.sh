#!/bin/bash
# CropHealth AI - Database Seeding Script
# Authors: Rohan Priyadarshan & Saket Kumawat

set -e

echo "======================================"
echo "CropHealth AI - Database Setup"
echo "======================================"

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-crophealth}
DB_USER=${DB_USER:-crophealth}

# Check if PostgreSQL is running
echo "Checking database connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running on $DB_HOST:$DB_PORT"
    exit 1
fi

echo "Connected to PostgreSQL"

# Run schema
echo "Creating database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql

echo ""
echo "✓ Database setup complete!"
echo ""
echo "Tables created:"
echo "  - User"
echo "  - DiseaseClass (38 diseases seeded)"
echo "  - PredictionRecord"
echo "  - ModelPerformance (5 models seeded)"
echo "  - TrainingLog"
echo "  - APIUsageLog"
echo ""
echo "Views created:"
echo "  - recent_predictions_summary"
echo "  - disease_statistics"
echo "  - model_comparison"
