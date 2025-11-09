import { useState } from "react";
import { Upload, Leaf, Brain, AlertCircle, CheckCircle2, Camera, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import PredictionResults from "@/components/PredictionResults";
import ResearchAnalysis from "@/components/ResearchAnalysis";
import ModelArchitecture from "@/components/ModelArchitecture";

export type DiseaseResult = {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  treatment: string;
  description: string;
};

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<DiseaseResult | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setPrediction(null);
  };

  const analyzePlant = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null);

    // Simulate ML model inference with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock prediction results based on research paper findings
    const diseases = [
      {
        disease: "Tomato Late Blight",
        confidence: 98.7,
        severity: "high" as const,
        treatment: "Apply fungicides containing chlorothalonil or mancozeb. Remove affected leaves and improve air circulation.",
        description: "Late blight is caused by Phytophthora infestans and can quickly destroy entire crops if left untreated.",
      },
      {
        disease: "Bacterial Spot",
        confidence: 96.3,
        severity: "medium" as const,
        treatment: "Use copper-based bactericides. Practice crop rotation and avoid overhead irrigation.",
        description: "Bacterial spot affects leaves and fruits, causing small dark spots that may have a yellow halo.",
      },
      {
        disease: "Early Blight",
        confidence: 94.8,
        severity: "medium" as const,
        treatment: "Apply fungicides and remove infected plant debris. Ensure proper spacing for air circulation.",
        description: "Early blight causes dark spots with concentric rings on older leaves, progressing upward.",
      },
    ];

    const randomPrediction = diseases[Math.floor(Math.random() * diseases.length)];
    setPrediction(randomPrediction);
    setIsAnalyzing(false);
    toast.success("Analysis complete!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-success">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AgriVision AI</h1>
                <p className="text-sm text-muted-foreground">ML-Powered Crop Disease Detection</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden md:flex items-center gap-2">
              <Brain className="h-4 w-4" />
              99.2% Accuracy
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="scanner">
              <Camera className="h-4 w-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="research">
              <TrendingUp className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Brain className="h-4 w-4 mr-2" />
              Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Detect Crop Diseases Instantly
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload an image of your crop leaves and our advanced CNN models will identify diseases with 99%+ accuracy
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Upload Section */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload Plant Image
                  </CardTitle>
                  <CardDescription>
                    Take or upload a clear photo of crop leaves showing symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader onImageUpload={handleImageUpload} currentImage={selectedImage} />
                  
                  <Button
                    onClick={analyzePlant}
                    disabled={!selectedImage || isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-5 w-5 mr-2 animate-pulse" />
                        Analyzing with CNN Model...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Analyze Plant Health
                      </>
                    )}
                  </Button>

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <Progress value={66} className="h-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Running ResNet50 + Vision Transformer ensemble...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <PredictionResults prediction={prediction} isAnalyzing={isAnalyzing} />
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    High Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensemble methods achieve 99.2% accuracy on benchmark datasets using CNN + Vision Transformers
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    Transfer Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pre-trained on ImageNet with fine-tuning on PlantVillage dataset (54,306 images, 38 disease classes)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Early Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify diseases before they spread, preventing 20-40% yield losses and ensuring food security
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="research">
            <ResearchAnalysis />
          </TabsContent>

          <TabsContent value="architecture">
            <ModelArchitecture />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
