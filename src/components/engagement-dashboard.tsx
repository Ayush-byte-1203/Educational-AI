
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { detectEngagement } from "@/ai/flows/detect-engagement";
import type { EngagementHistory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Video, Smile, Frown, Meh, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type EngagementDashboardProps = {
  engagementHistory: EngagementHistory;
  setEngagementHistory: React.Dispatch<React.SetStateAction<EngagementHistory>>;
};

const engagementMeta = {
    engaged: { icon: Smile, color: 'text-green-500', bgColor: 'bg-green-500/20' },
    neutral: { icon: Meh, color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
    disengaged: { icon: Frown, color: 'text-red-500', bgColor: 'bg-red-500/20' },
    confused: { icon: Brain, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
};


export default function EngagementDashboard({ engagementHistory, setEngagementHistory }: EngagementDashboardProps) {
  const [engagementLevel, setEngagementLevel] = useState("Determining...");
  const [suggestedIntervention, setSuggestedIntervention] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        toast({
          variant: "destructive",
          title: "Webcam Error",
          description: "Could not access webcam. Please check permissions.",
        });
      }
    };
    setupWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [toast]);
  
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current && !isDetecting) {
        setIsDetecting(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) {
          setIsDetecting(false);
          return;
        };
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUri = canvas.toDataURL("image/jpeg");

        try {
          const { engagementLevel, suggestedIntervention } = await detectEngagement({ photoDataUri });
          setEngagementLevel(engagementLevel);
          setSuggestedIntervention(suggestedIntervention);
          const levelKey = engagementLevel.toLowerCase().trim() as keyof EngagementHistory;
          if (Object.keys(engagementHistory).includes(levelKey)) {
            setEngagementHistory(prev => ({ ...prev, [levelKey]: prev[levelKey] + 1 }));
          }
        } catch (error) {
          console.error("Engagement detection error", error);
        } finally {
          setIsDetecting(false);
        }
      }
    }, 7000); // Check engagement every 7 seconds

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current)
    };
  }, [isDetecting, setEngagementHistory, engagementHistory]);

  const totalEngagements = Object.values(engagementHistory).reduce((sum, count) => sum + count, 0);

  const getGlowColor = () => {
    switch (engagementLevel.toLowerCase().trim()) {
      case 'engaged':
        return 'shadow-green-500/50';
      case 'confused':
        return 'shadow-yellow-500/50';
      case 'disengaged':
        return 'shadow-red-500/50';
      case 'neutral':
        return 'shadow-blue-500/50';
      default:
        return 'shadow-secondary';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Video className="w-6 h-6" />
          Engagement Monitor
        </CardTitle>
        <CardDescription>Real-time student engagement analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg border bg-muted transition-all duration-500 shadow-[0_0_15px_5px_rgba(0,0,0,0.3)]", getGlowColor())}>
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-3">
              {(Object.keys(engagementHistory) as Array<keyof EngagementHistory>).map((key) => {
                const MetaIcon = engagementMeta[key].icon;
                const percentage = totalEngagements > 0 ? (engagementHistory[key] / totalEngagements) * 100 : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium">
                        <MetaIcon className={cn("w-4 h-4", engagementMeta[key].color)} />
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      </div>
                      <span className="text-muted-foreground">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2 [&>div]:bg-gradient-to-r from-primary/50 to-primary" />
                  </div>
                );
              })}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm items-center">
          <div className="font-semibold">Current Status:</div>
          <div className="flex justify-end">
            <Badge variant={isDetecting ? "secondary" : "default"} className="min-w-[100px] text-center justify-center">{engagementLevel}</Badge>
          </div>
        </div>
        
        {suggestedIntervention && (
          <div className="text-sm p-3 bg-accent/20 border border-accent/50 rounded-md">
            <p className="font-semibold text-accent-foreground/80">Suggestion:</p>
            <p className="text-accent-foreground">{suggestedIntervention}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
