# AgriVision AI - Crop Disease Detection Prototype

An interactive web application demonstrating machine learning approaches for automated crop disease detection, based on the research paper **"Crop Disease Prediction Using Machine Learning: A Comprehensive Review and Analysis"** by Rohan Priyadarshan and Saket Kumawat.

![AgriVision AI](https://img.shields.io/badge/Accuracy-99.2%25-success)
![MIT License](https://img.shields.io/badge/License-Educational-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 🌾 Overview

This prototype showcases how deep learning models can identify crop diseases with 99%+ accuracy, helping farmers prevent 20-40% annual yield losses. The application demonstrates:

- **CNN-based disease classification** (ResNet50, DenseNet, VGG16)
- **Vision Transformer architectures** for advanced pattern recognition
- **Ensemble methods** combining multiple models
- **Mobile-optimized deployment** strategies
- **Comprehensive research analysis** of ML approaches

---

## ✨ Features

### 1. 📸 Disease Scanner
- Upload crop leaf images
- Real-time disease prediction
- Confidence scores and severity levels
- Treatment recommendations

### 2. 📊 Research Analysis
- Comprehensive paper summary
- Performance metrics comparison
- Dataset landscape overview
- Current challenges and solutions

### 3. 🧠 Model Architecture
- Detailed model comparisons
- Performance benchmarks
- Training pipeline visualization
- Optimization techniques

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 16+ and npm
```

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd agrivision-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:8080
```

---

## 📖 How to Use

### Scanning for Diseases

1. Navigate to the **Scanner** tab
2. Click the upload area or drag & drop a crop leaf image
3. Click **"Analyze Plant Health"**
4. Wait 2-3 seconds for CNN processing
5. View detailed results including:
   - Disease name and confidence score
   - Severity level (low/medium/high)
   - Treatment recommendations
   - Model information

### Exploring Research

1. Switch to the **Research** tab
2. Read the comprehensive analysis covering:
   - Research objectives and methodology
   - Key findings (99.2% accuracy with ensembles)
   - Dataset landscape (PlantVillage, PlantDoc)
   - Technical challenges and solutions

### Understanding Models

1. Visit the **Models** tab
2. Compare different architectures:
   - Ensemble (99.2%), Vision Transformer (98.5%)
   - DenseNet121 (98.3%), ResNet50 (97.8%)
   - MobileNet (95.8%) for mobile deployment
3. Learn about the training pipeline
4. Explore optimization techniques

---

## 🔬 Research Paper Summary

### Main Finding
Machine learning, particularly deep CNNs and Vision Transformers, achieves **95-99.5% accuracy** on benchmark crop disease datasets, with ensemble methods reaching **99.2%**.

### Key Architectures Analyzed

| Model | Accuracy | Parameters | Best For |
|-------|----------|------------|----------|
| Ensemble | 99.2% | ~110M | Maximum accuracy |
| Vision Transformer | 98.5% | 86M | Long-range patterns |
| DenseNet121 | 98.3% | 8.0M | Efficiency + accuracy |
| ResNet50 | 97.8% | 25.6M | Balanced performance |
| MobileNet | 95.8% | 4.2M | Mobile deployment |

### Datasets Used
- **PlantVillage:** 54,306 images, 38 disease classes, 14 crops
- **PlantDoc:** 2,598 field images (real conditions)
- **Specialized:** Rice, Tomato, Maize, Apple datasets

### Training Approach
1. Transfer learning from ImageNet
2. Data augmentation (rotation, flipping, color adjustments)
3. Adam/SGD optimizer with cosine annealing
4. Early stopping and regularization

---

## 🎯 Technical Implementation

### Frontend Stack
- **React 18** - Component-based UI
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful components
- **Vite** - Fast build tooling

### Design System
- **Primary:** Agricultural green (#2D7A4A)
- **Accent:** Golden yellow (#F5C842)
- **Semantic tokens** for consistency
- **Responsive** mobile-first design

### Prototype Features
- ✅ Image upload and preview
- ✅ Simulated ML inference (mock model)
- ✅ Real-time predictions
- ✅ Educational research content
- ✅ Interactive model comparisons

### Limitations (Current Prototype)
- Mock ML predictions (not real inference)
- Fixed disease database
- No backend integration
- Educational demonstration only

---

## 📊 Performance Metrics

### Crop-Specific Accuracy
- **Tomato:** 99.74% (10 disease classes)
- **Rice:** 98.86% (bacterial blight, blast, brown spots)
- **Potato:** 97.4% (early/late blight)
- **Corn/Maize:** 93.1% (less distinctive symptoms)

### Inference Speed
- MobileNet: 56ms (mobile CPU)
- ResNet50: 32ms (GPU)
- DenseNet121: 42ms (GPU)
- Vision Transformer: 95ms (GPU)
- Ensemble: 160ms (cloud deployment)

---

## 🔮 Future Enhancements

### Planned Features
1. **Real ML Integration**
   - TensorFlow.js implementation
   - Browser-based inference
   - Pre-trained MobileNet model

2. **Advanced Capabilities**
   - Real-time camera capture
   - Batch image processing
   - Disease history tracking
   - Explainable AI visualizations

3. **Backend Services**
   - User authentication
   - Cloud image storage
   - Database for records
   - RESTful API

4. **Research Extensions**
   - Multi-spectral imaging
   - Temporal analysis
   - Sensor integration
   - Federated learning

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Upload various image formats (PNG, JPG)
- [ ] Test file size validation (10MB limit)
- [ ] Verify prediction results display correctly
- [ ] Check responsive design on mobile
- [ ] Test all three tabs (Scanner, Research, Models)
- [ ] Validate accessibility features

### Example Test Cases
```bash
# Test Case 1: Image Upload
1. Navigate to Scanner tab
2. Upload test-leaf.jpg
3. Expected: Image displays in preview

# Test Case 2: Disease Analysis
1. Upload image
2. Click "Analyze Plant Health"
3. Expected: Results show within 3 seconds

# Test Case 3: Tab Navigation
1. Switch between Scanner/Research/Models tabs
2. Expected: Content loads instantly, no errors
```

---

## 📚 Documentation

### Full Research Analysis
See `RESEARCH_ANALYSIS.md` for:
- Detailed paper summary (800+ words)
- Complete methodology breakdown
- Technical assessment
- Implementation feasibility study
- Future research directions

### Code Documentation
- **src/pages/Index.tsx** - Main application page
- **src/components/ImageUploader.tsx** - File upload component
- **src/components/PredictionResults.tsx** - Results display
- **src/components/ResearchAnalysis.tsx** - Paper summary
- **src/components/ModelArchitecture.tsx** - Model comparisons

---

## 🌍 Real-World Impact

### Agricultural Significance
- Prevents **20-40% crop yield losses** annually
- Supports **9.7 billion population** by 2050
- Democratizes **agricultural expertise**
- Enables **precision farming** practices

### Technology Democratization
- Mobile-accessible for smallholder farmers
- Real-time diagnosis in remote areas
- Reduces dependence on expert availability
- Scalable to global food security challenges

---

## 🤝 Contributing

This is an educational prototype based on research paper analysis. For improvements:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is for **educational purposes** demonstrating ML concepts from the research paper:

**"Crop Disease Prediction Using Machine Learning: A Comprehensive Review and Analysis"**  
Authors: Rohan Priyadarshan, Saket Kumawat  
Institution: Manipal University Jaipur

---

## 🙏 Acknowledgments

- **Research Authors:** Rohan Priyadarshan, Saket Kumawat
- **Institution:** Department of Computer Applications, Manipal University Jaipur
- **Datasets:** PlantVillage, PlantDoc research teams
- **Framework:** React, Tailwind CSS, Shadcn UI communities

---

## 📧 Contact

For questions about the research paper or prototype implementation:

- **Research Paper:** rohanpriyadarshan.mca@gmail.com, saketkumawat3@gmail.com
- **Prototype Issues:** [GitHub Issues]

---

## 🔗 Useful Links

- [Research Paper PDF] (if available)
- [PlantVillage Dataset](https://plantvillage.psu.edu/)
- [PlantDoc Dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [React Documentation](https://react.dev/)

---

**Built with 💚 for precision agriculture and food security**

*Demonstrating how AI can help feed 9.7 billion people by 2050*
