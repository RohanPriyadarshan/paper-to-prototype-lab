-- ============================================
-- CropHealth AI - Database Schema
-- Version: 1.0.0
-- Authors: Rohan Priyadarshan & Saket Kumawat
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: User
-- Stores registered user information
-- ============================================
CREATE TABLE "User" (
    UserID VARCHAR(20) PRIMARY KEY DEFAULT CONCAT('USR_', LPAD(NEXTVAL('user_seq')::TEXT, 6, '0')),
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    FarmLocation VARCHAR(100),
    CropType VARCHAR(50),
    ExpertiseLevel INT CHECK (ExpertiseLevel BETWEEN 1 AND 5) DEFAULT 1,
    ProfileImageURL VARCHAR(255),
    IsActive BOOLEAN DEFAULT TRUE,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLoginDate TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE user_seq START 1;

CREATE INDEX idx_user_email ON "User"(Email);
CREATE INDEX idx_user_farm_location ON "User"(FarmLocation);

-- ============================================
-- TABLE: DiseaseClass
-- Master table for all supported crop diseases
-- ============================================
CREATE TABLE DiseaseClass (
    DiseaseID VARCHAR(10) PRIMARY KEY,
    DiseaseName VARCHAR(100) NOT NULL,
    Crop VARCHAR(50) NOT NULL,
    ScientificName VARCHAR(150),
    CausativeAgent VARCHAR(100),
    Description TEXT,
    Symptoms TEXT,
    TreatmentRecommendations TEXT,
    PreventionMeasures TEXT,
    SeverityLevels VARCHAR(100) DEFAULT 'Low,Medium,High',
    ImageSampleURL VARCHAR(255),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disease_crop ON DiseaseClass(Crop);
CREATE INDEX idx_disease_name ON DiseaseClass(DiseaseName);

-- ============================================
-- TABLE: PredictionRecord
-- Stores all prediction results
-- ============================================
CREATE TABLE PredictionRecord (
    PredictionID VARCHAR(30) PRIMARY KEY DEFAULT CONCAT('PRED_', TO_CHAR(NOW(), 'YYYYMMDD'), '_', LPAD(NEXTVAL('pred_seq')::TEXT, 5, '0')),
    UserID VARCHAR(20) NOT NULL,
    ImagePath VARCHAR(255) NOT NULL,
    ImageThumbnailPath VARCHAR(255),
    PredictionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PrimaryDisease VARCHAR(10) NOT NULL,
    Confidence FLOAT CHECK (Confidence BETWEEN 0.0 AND 1.0),
    SecondaryDisease VARCHAR(10),
    SecondaryConfidence FLOAT,
    TertiaryDisease VARCHAR(10),
    TertiaryConfidence FLOAT,
    ModelUsed VARCHAR(50) DEFAULT 'Ensemble',
    InferenceTimeMs FLOAT,
    GradCAMImagePath VARCHAR(255),
    FinalVerification BOOLEAN DEFAULT FALSE,
    VerifiedBy VARCHAR(20),
    VerificationDate TIMESTAMP,
    TreatmentRecommendation TEXT,
    UserFeedback INT CHECK (UserFeedback BETWEEN 1 AND 5),
    FeedbackComment TEXT,
    DeviceInfo VARCHAR(100),
    GPSLatitude DECIMAL(10, 8),
    GPSLongitude DECIMAL(11, 8),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES "User"(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PrimaryDisease) REFERENCES DiseaseClass(DiseaseID),
    FOREIGN KEY (SecondaryDisease) REFERENCES DiseaseClass(DiseaseID),
    FOREIGN KEY (TertiaryDisease) REFERENCES DiseaseClass(DiseaseID),
    FOREIGN KEY (VerifiedBy) REFERENCES "User"(UserID)
);

CREATE SEQUENCE pred_seq START 1;

CREATE INDEX idx_prediction_user ON PredictionRecord(UserID);
CREATE INDEX idx_prediction_date ON PredictionRecord(PredictionDate);
CREATE INDEX idx_prediction_disease ON PredictionRecord(PrimaryDisease);
CREATE INDEX idx_prediction_confidence ON PredictionRecord(Confidence);

-- ============================================
-- TABLE: ModelPerformance
-- Tracks ML model metrics and versions
-- ============================================
CREATE TABLE ModelPerformance (
    ModelID VARCHAR(10) PRIMARY KEY,
    ModelName VARCHAR(50) NOT NULL,
    ModelVersion VARCHAR(20) DEFAULT '1.0.0',
    Architecture VARCHAR(30) NOT NULL,
    BaseWeights VARCHAR(50) DEFAULT 'ImageNet',
    TrainingDate TIMESTAMP NOT NULL,
    TrainingDatasetSize INT,
    ValidationDatasetSize INT,
    TestDatasetSize INT,
    NumEpochs INT,
    BatchSize INT,
    LearningRate FLOAT,
    Optimizer VARCHAR(30) DEFAULT 'Adam',
    Accuracy FLOAT NOT NULL CHECK (Accuracy BETWEEN 0.0 AND 1.0),
    Precision FLOAT CHECK (Precision BETWEEN 0.0 AND 1.0),
    Recall FLOAT CHECK (Recall BETWEEN 0.0 AND 1.0),
    F1Score FLOAT CHECK (F1Score BETWEEN 0.0 AND 1.0),
    AUC_ROC FLOAT CHECK (AUC_ROC BETWEEN 0.0 AND 1.0),
    ParameterCount BIGINT,
    ModelSizeMB FLOAT,
    InferenceTimeMs FLOAT,
    ModelFilePath VARCHAR(255),
    TFLiteFilePath VARCHAR(255),
    IsProduction BOOLEAN DEFAULT FALSE,
    IsEnsembleMember BOOLEAN DEFAULT FALSE,
    EnsembleWeight FLOAT DEFAULT 1.0,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_model_architecture ON ModelPerformance(Architecture);
CREATE INDEX idx_model_production ON ModelPerformance(IsProduction);

-- ============================================
-- TABLE: TrainingLog
-- Logs training progress and metrics per epoch
-- ============================================
CREATE TABLE TrainingLog (
    LogID SERIAL PRIMARY KEY,
    ModelID VARCHAR(10) NOT NULL,
    Epoch INT NOT NULL,
    TrainingLoss FLOAT,
    ValidationLoss FLOAT,
    TrainingAccuracy FLOAT,
    ValidationAccuracy FLOAT,
    LearningRate FLOAT,
    Duration_Seconds INT,
    LoggedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ModelID) REFERENCES ModelPerformance(ModelID) ON DELETE CASCADE
);

CREATE INDEX idx_training_model ON TrainingLog(ModelID);

-- ============================================
-- TABLE: APIUsageLog
-- Tracks API usage for analytics and billing
-- ============================================
CREATE TABLE APIUsageLog (
    LogID SERIAL PRIMARY KEY,
    UserID VARCHAR(20),
    Endpoint VARCHAR(100) NOT NULL,
    Method VARCHAR(10) NOT NULL,
    StatusCode INT,
    ResponseTimeMs INT,
    RequestSize INT,
    ResponseSize INT,
    IPAddress VARCHAR(45),
    UserAgent VARCHAR(255),
    RequestTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES "User"(UserID) ON DELETE SET NULL
);

CREATE INDEX idx_api_user ON APIUsageLog(UserID);
CREATE INDEX idx_api_timestamp ON APIUsageLog(RequestTimestamp);
CREATE INDEX idx_api_endpoint ON APIUsageLog(Endpoint);

-- ============================================
-- SEED DATA: Disease Classes (38 diseases)
-- ============================================
INSERT INTO DiseaseClass (DiseaseID, DiseaseName, Crop, Description, Symptoms, TreatmentRecommendations) VALUES
-- Tomato Diseases
('TOM_EB', 'Early Blight', 'Tomato', 'Fungal disease caused by Alternaria solani', 'Dark spots with concentric rings, yellowing leaves', 'Apply copper-based fungicide, remove infected leaves'),
('TOM_LB', 'Late Blight', 'Tomato', 'Oomycete disease caused by Phytophthora infestans', 'Water-soaked spots, white fuzzy growth', 'Apply fungicide, destroy infected plants'),
('TOM_LS', 'Leaf Spot', 'Tomato', 'Bacterial leaf spot caused by Xanthomonas', 'Small dark spots with yellow halos', 'Copper sprays, crop rotation'),
('TOM_SM', 'Spider Mites', 'Tomato', 'Infestation by two-spotted spider mites', 'Stippling, webbing on leaves', 'Neem oil, insecticidal soap'),
('TOM_TV', 'Target Spot', 'Tomato', 'Fungal disease caused by Corynespora cassiicola', 'Brown spots with concentric rings', 'Fungicide application, proper spacing'),
('TOM_YL', 'Yellow Leaf Curl', 'Tomato', 'Viral disease transmitted by whiteflies', 'Upward curling, yellowing leaves', 'Control whiteflies, remove infected plants'),
('TOM_MV', 'Mosaic Virus', 'Tomato', 'Tobacco mosaic virus infection', 'Mottled yellow-green leaves', 'Remove infected plants, sanitize tools'),
('TOM_BS', 'Bacterial Spot', 'Tomato', 'Caused by Xanthomonas bacteria', 'Water-soaked lesions on leaves', 'Copper bactericides, resistant varieties'),
('TOM_SW', 'Septoria Leaf Spot', 'Tomato', 'Fungal disease by Septoria lycopersici', 'Small circular spots with dark borders', 'Fungicides, remove lower leaves'),
('TOM_HL', 'Healthy', 'Tomato', 'No disease detected', 'Normal green foliage', 'Continue regular maintenance'),

-- Potato Diseases
('POT_EB', 'Early Blight', 'Potato', 'Fungal disease caused by Alternaria solani', 'Dark concentric spots on leaves', 'Fungicide, crop rotation'),
('POT_LB', 'Late Blight', 'Potato', 'Phytophthora infestans infection', 'Brown lesions, white mold', 'Systemic fungicides, destroy infected'),
('POT_HL', 'Healthy', 'Potato', 'No disease detected', 'Normal healthy foliage', 'Regular maintenance'),

-- Corn/Maize Diseases
('CRN_CR', 'Common Rust', 'Corn', 'Fungal rust by Puccinia sorghi', 'Orange-brown pustules on leaves', 'Fungicides, resistant hybrids'),
('CRN_NL', 'Northern Leaf Blight', 'Corn', 'Caused by Exserohilum turcicum', 'Long cigar-shaped lesions', 'Fungicides, crop rotation'),
('CRN_GS', 'Gray Leaf Spot', 'Corn', 'Cercospora zeae-maydis infection', 'Rectangular gray lesions', 'Resistant varieties, tillage'),
('CRN_HL', 'Healthy', 'Corn', 'No disease detected', 'Normal green foliage', 'Continue regular care'),

-- Rice Diseases
('RIC_BB', 'Bacterial Leaf Blight', 'Rice', 'Xanthomonas oryzae infection', 'Yellow-orange lesions, wilting', 'Resistant varieties, balanced fertilizer'),
('RIC_BL', 'Brown Spot', 'Rice', 'Bipolaris oryzae fungal infection', 'Oval brown spots with gray centers', 'Seed treatment, balanced nutrition'),
('RIC_LB', 'Leaf Blast', 'Rice', 'Magnaporthe oryzae fungal infection', 'Diamond-shaped lesions', 'Fungicides, resistant varieties'),
('RIC_HL', 'Healthy', 'Rice', 'No disease detected', 'Normal healthy growth', 'Regular maintenance'),

-- Apple Diseases
('APL_SC', 'Apple Scab', 'Apple', 'Venturia inaequalis fungal infection', 'Olive-brown spots on leaves/fruit', 'Fungicides, remove fallen leaves'),
('APL_BR', 'Black Rot', 'Apple', 'Botryosphaeria obtusa infection', 'Brown rotting fruit, frog-eye spots', 'Prune infected areas, fungicides'),
('APL_CR', 'Cedar Apple Rust', 'Apple', 'Gymnosporangium juniperi-virginianae', 'Orange spots with black dots', 'Remove nearby cedars, fungicides'),
('APL_HL', 'Healthy', 'Apple', 'No disease detected', 'Normal healthy foliage', 'Regular maintenance'),

-- Grape Diseases
('GRP_BR', 'Black Rot', 'Grape', 'Guignardia bidwellii fungal infection', 'Brown spots, mummified berries', 'Fungicides, remove infected parts'),
('GRP_EC', 'Esca (Black Measles)', 'Grape', 'Fungal trunk disease complex', 'Tiger stripe patterns on leaves', 'Trunk surgery, preventive pruning'),
('GRP_LB', 'Leaf Blight', 'Grape', 'Isariopsis leaf spot', 'Brown irregular spots', 'Fungicide application'),
('GRP_HL', 'Healthy', 'Grape', 'No disease detected', 'Normal green foliage', 'Continue regular care'),

-- Pepper Diseases
('PEP_BS', 'Bacterial Spot', 'Pepper', 'Xanthomonas bacterial infection', 'Water-soaked lesions', 'Copper sprays, resistant varieties'),
('PEP_HL', 'Healthy', 'Pepper', 'No disease detected', 'Normal healthy growth', 'Regular maintenance'),

-- Strawberry Diseases
('STR_LS', 'Leaf Scorch', 'Strawberry', 'Diplocarpon earlianum infection', 'Purple-red spots, leaf margins scorch', 'Remove infected leaves, fungicides'),
('STR_HL', 'Healthy', 'Strawberry', 'No disease detected', 'Normal healthy foliage', 'Regular maintenance'),

-- Cherry Diseases
('CHR_PM', 'Powdery Mildew', 'Cherry', 'Podosphaera clandestina infection', 'White powdery coating on leaves', 'Fungicides, improve air circulation'),
('CHR_HL', 'Healthy', 'Cherry', 'No disease detected', 'Normal healthy foliage', 'Regular maintenance'),

-- Peach Diseases
('PCH_BS', 'Bacterial Spot', 'Peach', 'Xanthomonas arboricola infection', 'Dark spots on leaves and fruit', 'Copper sprays, resistant varieties'),
('PCH_HL', 'Healthy', 'Peach', 'No disease detected', 'Normal healthy growth', 'Continue regular care'),

-- Soybean Diseases
('SOY_HL', 'Healthy', 'Soybean', 'No disease detected', 'Normal healthy foliage', 'Regular maintenance');

-- ============================================
-- SEED DATA: Model Performance Records
-- ============================================
INSERT INTO ModelPerformance (ModelID, ModelName, Architecture, TrainingDate, Accuracy, Precision, Recall, F1Score, ParameterCount, InferenceTimeMs, IsProduction, IsEnsembleMember, EnsembleWeight) VALUES
('MOD_001', 'CropHealth-ResNet50', 'ResNet50', '2024-11-01', 0.9645, 0.9589, 0.9612, 0.9600, 25600000, 45, TRUE, TRUE, 0.30),
('MOD_002', 'CropHealth-DenseNet121', 'DenseNet121', '2024-11-01', 0.9712, 0.9678, 0.9695, 0.9686, 8000000, 52, TRUE, TRUE, 0.35),
('MOD_003', 'CropHealth-InceptionV3', 'InceptionV3', '2024-11-01', 0.9534, 0.9498, 0.9521, 0.9509, 23900000, 68, TRUE, TRUE, 0.15),
('MOD_004', 'CropHealth-ViT', 'Vision Transformer', '2024-11-01', 0.9801, 0.9756, 0.9778, 0.9767, 86000000, 95, TRUE, TRUE, 0.20),
('MOD_ENS', 'CropHealth-Ensemble', 'Ensemble', '2024-11-01', 0.9856, 0.9823, 0.9841, 0.9832, 143500000, 180, TRUE, FALSE, 1.0);

-- ============================================
-- VIEWS
-- ============================================

-- View: Recent Predictions Summary
CREATE VIEW recent_predictions_summary AS
SELECT 
    p.PredictionID,
    u.Name AS UserName,
    d.DiseaseName,
    d.Crop,
    p.Confidence,
    p.PredictionDate
FROM PredictionRecord p
JOIN "User" u ON p.UserID = u.UserID
JOIN DiseaseClass d ON p.PrimaryDisease = d.DiseaseID
ORDER BY p.PredictionDate DESC
LIMIT 100;

-- View: Disease Detection Statistics
CREATE VIEW disease_statistics AS
SELECT 
    d.Crop,
    d.DiseaseName,
    COUNT(*) AS DetectionCount,
    AVG(p.Confidence) AS AvgConfidence
FROM PredictionRecord p
JOIN DiseaseClass d ON p.PrimaryDisease = d.DiseaseID
GROUP BY d.Crop, d.DiseaseName
ORDER BY DetectionCount DESC;

-- View: Model Performance Comparison
CREATE VIEW model_comparison AS
SELECT 
    ModelName,
    Architecture,
    Accuracy,
    Precision,
    Recall,
    F1Score,
    InferenceTimeMs,
    ROUND(ParameterCount / 1000000.0, 2) AS ParametersMillion
FROM ModelPerformance
WHERE IsProduction = TRUE
ORDER BY F1Score DESC;

-- ============================================
-- END OF SCHEMA
-- ============================================
