"use client";

import { useState } from "react";
import type { EngagementHistory } from "@/lib/types";
import Header from "@/components/header";
import QueryInput from "@/components/query-input";
import ResponseDisplay from "@/components/response-display";
import EngagementDashboard from "@/components/engagement-dashboard";
import { useToast } from "@/hooks/use-toast";
import { generateResponse, GenerateResponseOutput } from "@/ai/flows/generate-response";

export default function ClassroomAICompanion() {
  const [response, setResponse] = useState<GenerateResponseOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });

  const { toast } = useToast();

  const handleQuerySubmit = async (textQuery?: string, voiceDataUri?: string, imageDataUri?: string) => {
    if (!textQuery && !voiceDataUri && !imageDataUri) {
      toast({
        variant: "destructive",
        title: "Input Error",
        description: "Please provide a query in text, voice, or image format.",
      });
      return;
    }
    
    setIsGenerating(true);
    setResponse(null);

    try {
      const result = await generateResponse({ textQuery, voiceDataUri, imageDataUri });
      setResponse(result);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate a response. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <ResponseDisplay response={response?.response} isLoading={isGenerating} />
            <QueryInput onSubmit={handleQuerySubmit} isGenerating={isGenerating} />
          </div>
          <div className="flex flex-col gap-6">
            <EngagementDashboard
              engagementHistory={engagementHistory}
              setEngagementHistory={setEngagementHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
