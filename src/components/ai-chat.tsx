"use client";

import { useState } from "react";
import QueryInput from "@/components/query-input";
import ResponseDisplay from "@/components/response-display";
import { useToast } from "@/hooks/use-toast";
import { generateResponse, GenerateResponseOutput } from "@/ai/flows/generate-response";

export default function AIChat() {
  const [response, setResponse] = useState<GenerateResponseOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
    <div className="flex flex-col gap-4 h-full">
        <ResponseDisplay response={response?.response} isLoading={isGenerating} />
        <QueryInput onSubmit={handleQuerySubmit} isGenerating={isGenerating} />
    </div>
  )
}
