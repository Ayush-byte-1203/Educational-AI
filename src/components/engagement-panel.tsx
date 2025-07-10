
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { detectEngagement } from "@/ai/flows/detect-engagement";
import type { EngagementHistory } from "@/lib/types";
import { Smile, Frown, Meh, Brain, AlertCircle, VideoOff, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type EngagementPanelProps = {
  engagementHistory: EngagementHistory;
  setEngagementHistory: React.Dispatch<React.SetStateAction<EngagementHistory>>;
  stream: MediaStream | null;
  isCameraOn: boolean;
};

const engagementMeta: Record<keyof EngagementHistory, { icon: React.ElementType, label: string, color: string, progressClass: string }> = {
    engaged: { icon: Smile, label: 'Engaged', color: 'text-green-500', progressClass: 'bg-green-500' },
    neutral: { icon: Meh, label: 'Neutral', color: 'text-blue-500', progressClass: 'bg-blue-500' },
    disengaged: { icon: Frown, label: 'Disengaged', color: 'text-red-500', progressClass: 'bg-red-500' },
    confused: { icon: Brain, label: 'Confused', color: 'text-yellow-500', progressClass: 'bg-yellow-500' },
};

export default function EngagementPanel({ engagementHistory, setEngagementHistory, stream, isCameraOn }: EngagementPanelProps) {
  const [engagementLevel, setEngagementLevel] = useState<keyof EngagementHistory | 'determining' | 'error'>("determining");
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (isCameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setEngagementLevel('determining');
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream, isCameraOn]);
  
  useEffect(() => {
    if (isCameraOn && stream) {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current && !isDetecting) {
          setIsDetecting(true);
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          if (!context || canvas.width === 0 || canvas.height === 0) {
            setIsDetecting(false);
            return;
          };
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const photoDataUri = canvas.toDataURL("image/jpeg");
  
          try {
            const { engagementLevel: level } = await detectEngagement({ photoDataUri });
            const levelKey = level.toLowerCase().trim() as keyof EngagementHistory;
            if (Object.keys(engagementMeta).includes(levelKey)) {
              setEngagementLevel(levelKey);
              setEngagementHistory(prev => ({ ...prev, [levelKey]: prev[levelKey] + 1 }));
            }
          } catch (error) {
            console.error("Engagement detection error", error);
            setEngagementLevel('error');
            toast({
                variant: 'destructive',
                title: 'Engagement Detection Failed',
                description: 'Could not analyze engagement. You may have exceeded the API quota.',
            });
          } finally {
            setIsDetecting(false);
          }
        }
      }, 30000); // Check engagement every 30 seconds
    }

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetecting, setEngagementHistory, isCameraOn, stream]);

  const CurrentIcon = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].icon : AlertCircle;
  const currentColor = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].color : 'text-gray-500';
  const totalEngagements = Object.values(engagementHistory).reduce((a, b) => a + b, 0);

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <HeartPulse />
                Engagement Status
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            <div className="relative aspect-video rounded-md overflow-hidden border bg-black">
                <video ref={videoRef} autoPlay muted playsInline className={cn("w-full h-full object-cover", { "hidden": !isCameraOn })} />
                {!isCameraOn && <div className="w-full h-full flex items-center justify-center"><VideoOff className="w-8 h-8 text-muted-foreground" /></div>}
                <canvas ref={canvasRef} className="hidden" />
                 {isCameraOn && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/50 text-white p-1.5 rounded-md">
                        <CurrentIcon className={cn("w-5 h-5", currentColor)} />
                        <span className="capitalize text-sm font-medium">{isDetecting ? 'Analyzing...' : engagementLevel}</span>
                    </div>
                 )}
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold">Engagement Breakdown</h3>
                {Object.entries(engagementMeta).map(([key, value]) => {
                    const count = engagementHistory[key as keyof EngagementHistory];
                    const percentage = totalEngagements > 0 ? (count / totalEngagements) * 100 : 0;
                    return (
                        <div key={key}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <div className="flex items-center gap-2">
                                    <value.icon className={cn("w-4 h-4", value.color)} />
                                    <span>{value.label}</span>
                                </div>
                                <span>{Math.round(percentage)}%</span>
                            </div>
                            <Progress value={percentage} className="h-2 [&>div]:bg-none" style={{'--indicator-bg': `hsl(var(--${value.progressClass.replace('bg-', '')}))`} as any} />
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
  );
}
