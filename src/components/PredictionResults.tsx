import { AlertTriangle, CheckCircle2, Info, Pill } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { DiseaseResult } from "@/pages/Index";

type PredictionResultsProps = {
  prediction: DiseaseResult | null;
  isAnalyzing: boolean;
};

const PredictionResults = ({ prediction, isAnalyzing }: PredictionResultsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analyzing...</CardTitle>
          <CardDescription>Processing image with neural network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 bg-muted/50 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Running CNN inference...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detection Results</CardTitle>
          <CardDescription>Upload an image to begin analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Results will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detection Results</span>
          <Badge variant={getSeverityColor(prediction.severity)} className="flex items-center gap-1">
            {getSeverityIcon(prediction.severity)}
            {prediction.severity.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription>Analysis based on ResNet50 + ViT ensemble model</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disease Name */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{prediction.disease}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-semibold text-foreground">{prediction.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2" />
          </div>
        </div>

        {/* Description */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>About this disease</AlertTitle>
          <AlertDescription className="text-sm">{prediction.description}</AlertDescription>
        </Alert>

        {/* Treatment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Pill className="h-4 w-4 text-primary" />
            Recommended Treatment
          </div>
          <p className="text-sm text-muted-foreground pl-6">{prediction.treatment}</p>
        </div>

        {/* Model Info */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Model Architecture</p>
              <p className="font-medium">ResNet50 + ViT</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Dataset</p>
              <p className="font-medium">PlantVillage</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Classes</p>
              <p className="font-medium">38 Diseases</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Inference Time</p>
              <p className="font-medium">~32ms (GPU)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
