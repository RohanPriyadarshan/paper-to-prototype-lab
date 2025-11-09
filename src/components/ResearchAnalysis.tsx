import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Database, Target, TrendingUp, Users, Zap } from "lucide-react";

const ResearchAnalysis = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Paper Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Research Paper Analysis</CardTitle>
          </div>
          <CardDescription>
            Crop Disease Prediction Using Machine Learning: A Comprehensive Review and Analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2">Main Research Question</h3>
            <p className="text-muted-foreground mb-4">
              How can machine learning and computer vision techniques be effectively applied to automate the prediction
              and classification of crop diseases, addressing the global challenge of 20-40% annual yield losses due to
              plant diseases?
            </p>

            <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Ensemble Methods:</strong> Combining CNNs with Vision Transformers achieves best accuracy
                (99.2-99.5%) on PlantVillage dataset
              </li>
              <li>
                <strong>Transfer Learning:</strong> Pre-trained models show 5-15% performance gain over training from
                scratch
              </li>
              <li>
                <strong>Mobile Deployment:</strong> MobileNet achieves 95.8-97.3% accuracy with only 4.2M parameters,
                suitable for edge devices
              </li>
              <li>
                <strong>Architecture Performance:</strong> ResNet50 (97.8-98.9%), InceptionV3 (98.1-98.6%), DenseNet121
                (98.3-99.1%)
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 mt-4">Novel Contributions</h3>
            <p className="text-muted-foreground">
              This comprehensive review synthesizes current ML-based approaches, identifies critical challenges (dataset
              bias, computational constraints, limited crop coverage), and proposes emerging solutions including
              federated learning, explainable AI, and domain adaptation for real-world agricultural deployment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Assessment */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Core Algorithms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                Convolutional Neural Networks
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">VGG16 (96.5-98.2%)</Badge>
                <Badge variant="secondary">ResNet50 (97.8-98.9%)</Badge>
                <Badge variant="secondary">InceptionV3 (98.1-98.6%)</Badge>
                <Badge variant="secondary">DenseNet121 (98.3-99.1%)</Badge>
                <Badge variant="secondary">MobileNet (95.8-97.3%)</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Vision Transformers</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">ViT (98.5-99.2%)</Badge>
                <Badge variant="secondary">MobileViT (97.8%, 5.6M params)</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Ensemble Methods</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Voting (99.2%)</Badge>
                <Badge variant="secondary">Stacking</Badge>
                <Badge variant="secondary">Boosting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Datasets & Preprocessing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Benchmark Datasets</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PlantVillage: 54,306 images, 38 classes, 14 crops</li>
                <li>• PlantDoc: 2,598 field images (real conditions)</li>
                <li>• Rice Pest Dataset (98.86% accuracy)</li>
                <li>• Tomato Disease Dataset (99.74% accuracy)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Preprocessing Pipeline</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resizing: 224×224 or 299×299</li>
                <li>• Augmentation: rotation (±20°), flipping, cropping</li>
                <li>• Color: brightness (±20%), contrast, saturation</li>
                <li>• Advanced: CutMix, MixUp, random erasing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Details */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Training Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Optimization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adam / SGD (momentum: 0.9)</li>
                <li>• LR: 0.001 → 0.0001</li>
                <li>• Cosine annealing / step decay</li>
                <li>• Batch size: 32</li>
                <li>• Epochs: 50-100</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Regularization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dropout: 0.3-0.5</li>
                <li>• L2 weight decay: 1e-4</li>
                <li>• Batch normalization</li>
                <li>• Early stopping (patience: 10)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Performance Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Accuracy</li>
                <li>• Precision</li>
                <li>• Recall (Sensitivity)</li>
                <li>• F1-Score</li>
                <li>• Categorical cross-entropy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges & Solutions */}
      <Card className="shadow-lg border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Current Challenges & Future Directions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-destructive">Challenges</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dataset bias: 15-30% accuracy drop on field images</li>
                <li>• Class imbalance: rare diseases underrepresented</li>
                <li>• Similar disease symptoms hard to distinguish</li>
                <li>• Multi-disease scenarios not well captured</li>
                <li>• Computational constraints for smallholder farmers</li>
                <li>• Limited crop and disease coverage</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-success">Emerging Solutions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Federated learning (99% accuracy retention)</li>
                <li>• Domain adaptation (5-10% degradation reduction)</li>
                <li>• Few-shot learning (1-5 examples)</li>
                <li>• Explainable AI (Grad-CAM, LIME)</li>
                <li>• Multi-modal learning (vision + sensors)</li>
                <li>• Synthetic data generation (GANs)</li>
                <li>• Edge AI optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Impact */}
      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Impact & Implications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Global Food Security:</strong> With the world population projected to
              reach 9.7 billion by 2050, preventing 20-40% crop yield losses through early disease detection is critical
              for increasing food production by the required 70%.
            </p>
            <p>
              <strong className="text-foreground">Accessibility:</strong> Mobile-optimized models (MobileNet, MobileViT)
              enable deployment on smartphones, bringing agricultural expertise to remote and resource-constrained
              farming areas.
            </p>
            <p>
              <strong className="text-foreground">Precision Agriculture:</strong> Real-time diagnostic feedback through
              edge AI and cloud computing allows farmers to take immediate action, reducing chemical usage and
              environmental impact.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAnalysis;
