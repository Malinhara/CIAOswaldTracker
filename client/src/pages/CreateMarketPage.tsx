import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Home, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

type MarketFormData = {
  title: string;
  yesResolution: string;
  noResolution: string;
};

const steps = [
  {
    title: "Market Question",
    description: "What question would you like the market to predict?",
  },
  {
    title: "Resolution Conditions",
    description: "Define how the market will be resolved",
  },
  {
    title: "Review & Submit",
    description: "Review market details before creation",
  },
];

export default function CreateMarketPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MarketFormData>({
    defaultValues: {
      title: "",
      yesResolution: "",
      noResolution: "",
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  // Render different form content based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="title">Market Question</Label>
            <Input
              id="title"
              placeholder="Will X happen by Y date?"
              {...form.register("title", { required: true })}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="yesResolution">"Yes" Resolution Condition</Label>
              <Textarea
                id="yesResolution"
                placeholder="The market will resolve as 'Yes' if..."
                {...form.register("yesResolution", { required: true })}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="noResolution">"No" Resolution Condition</Label>
              <Textarea
                id="noResolution"
                placeholder="The market will resolve as 'No' if..."
                {...form.register("noResolution", { required: true })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Market Question</h3>
              <p className="text-muted-foreground">{form.getValues("title")}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Resolution Conditions</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm">Yes Resolution:</p>
                  <p className="text-muted-foreground">{form.getValues("yesResolution")}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">No Resolution:</p>
                  <p className="text-muted-foreground">{form.getValues("noResolution")}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: MarketFormData) => {
    try {
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const newMarket = await response.json();
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      
      toast({
        title: "Success",
        description: "Market created successfully",
      });

      navigate('/markets');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create market",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">Tinfoil</h2>
              <p className="text-sm text-muted-foreground">Question it All</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="ghost">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/markets/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {renderStepContent()}

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  
                  {currentStep === steps.length - 1 ? (
                    <Button type="submit">Create Market</Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}