import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, Layers, Zap, Clock, HardDrive } from "lucide-react";

const ModelArchitecture = () => {
  const models = [
    {
      name: "Ensemble (CNN + ViT)",
      accuracy: 99.2,
      params: "~110M",
      inference: "160ms",
      deployment: "Cloud",
      color: "primary",
      description: "Best accuracy through combining complementary architectures",
    },
    {
      name: "Vision Transformer",
      accuracy: 98.5,
      params: "86M",
      inference: "95ms",
      deployment: "GPU",
      color: "accent",
      description: "Captures long-range dependencies with self-attention",
    },
    {
      name: "DenseNet121",
      accuracy: 98.3,
      params: "8.0M",
      inference: "42ms",
      deployment: "GPU",
      color: "success",
      description: "Dense connections enhance gradient flow",
    },
    {
      name: "ResNet50",
      accuracy: 97.8,
      params: "25.6M",
      inference: "32ms",
      deployment: "GPU",
      color: "secondary",
      description: "Residual connections enable very deep networks",
    },
    {
      name: "InceptionV3",
      accuracy: 98.1,
      params: "23.8M",
      inference: "38ms",
      deployment: "GPU",
      color: "secondary",
      description: "Multi-scale feature extraction via inception modules",
    },
    {
      name: "MobileNet",
      accuracy: 95.8,
      params: "4.2M",
      inference: "56ms (CPU)",
      deployment: "Mobile/Edge",
      color: "warning",
      description: "Lightweight architecture for mobile deployment",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Overview */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Model Architecture Comparison</CardTitle>
          </div>
          <CardDescription>
            Performance analysis of different CNN and transformer architectures for crop disease detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            All models are pre-trained on ImageNet and fine-tuned on the PlantVillage dataset (54,306 images across 38
            disease classes). Transfer learning provides a 5-15% accuracy improvement over training from scratch.
          </p>
        </CardContent>
      </Card>

      {/* Model Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {models.map((model, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge variant={model.color as any}>{model.deployment}</Badge>
              </div>
              <CardDescription className="text-xs">{model.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Accuracy */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-bold text-lg">{model.accuracy}%</span>
                </div>
                <Progress value={model.accuracy} className="h-2" />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HardDrive className="h-3 w-3" />
                    Params
                  </div>
                  <p className="text-sm font-semibold">{model.params}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Inference
                  </div>
                  <p className="text-sm font-semibold">{model.inference}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Cpu className="h-3 w-3" />
                    Deploy
                  </div>
                  <p className="text-sm font-semibold">{model.deployment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Architecture */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Training Pipeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: "1. Image Acquisition",
                description: "Camera, smartphone, or UAV capture of crop leaves",
                icon: "📷",
              },
              {
                step: "2. Preprocessing",
                description: "Resize (224×224), normalize, augmentation (rotation, flip, color adjustments)",
                icon: "⚙️",
              },
              {
                step: "3. Feature Extraction",
                description: "CNN layers extract hierarchical visual features automatically",
                icon: "🔍",
              },
              {
                step: "4. Transfer Learning",
                description: "Fine-tune pre-trained ImageNet weights with reduced learning rate (1e-4 to 1e-5)",
                icon: "🎯",
              },
              {
                step: "5. Classification",
                description: "Softmax layer predicts disease class with confidence scores",
                icon: "✨",
              },
              {
                step: "6. Post-processing",
                description: "Ensemble voting, attention visualization, treatment recommendations",
                icon: "📊",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-3 rounded-lg bg-muted/30">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{item.step}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Techniques */}
      <Card className="shadow-lg bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Mobile Optimization Techniques</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Model Quantization</h4>
              <p className="text-xs text-muted-foreground">
                INT8 quantization provides 4× speedup while maintaining 97-99% of original accuracy
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Model Pruning</h4>
              <p className="text-xs text-muted-foreground">
                Remove redundant parameters to achieve 30-50% size reduction without significant accuracy loss
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Knowledge Distillation</h4>
              <p className="text-xs text-muted-foreground">
                Transfer knowledge from large ensemble to compact student model, achieving 10-50× speedup
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop-Specific Performance */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Crop-Specific Performance</CardTitle>
          <CardDescription>Model accuracy varies based on dataset characteristics and disease symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { crop: "Tomato", accuracy: 99.74, classes: 10, note: "Clear disease symptoms, large training sample" },
              { crop: "Rice", accuracy: 98.86, classes: 3, note: "Bacterial blight, blast, brown spots" },
              { crop: "Potato", accuracy: 97.4, classes: 2, note: "Early and late blight classification" },
              { crop: "Corn/Maize", accuracy: 93.1, classes: 4, note: "Less distinctive visual symptoms" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{item.crop}</span>
                    <span className="text-xs text-muted-foreground ml-2">({item.classes} disease classes)</span>
                  </div>
                  <span className="font-bold">{item.accuracy}%</span>
                </div>
                <Progress value={item.accuracy} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelArchitecture;
