
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { detectEngagement } from "@/ai/flows/detect-engagement";
import type { EngagementHistory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Smile, Frown, Meh, Brain, AlertCircle, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type EngagementDashboardProps = {
  engagementHistory: EngagementHistory;
  setEngagementHistory: React.Dispatch<React.SetStateAction<EngagementHistory>>;
  stream: MediaStream | null;
  isCameraOn: boolean;
};

const engagementMeta = {
    engaged: { icon: Smile, color: 'text-green-500', bgColor: 'bg-green-500/20' },
    neutral: { icon: Meh, color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
    disengaged: { icon: Frown, color: 'text-red-500', bgColor: 'bg-red-500/20' },
    confused: { icon: Brain, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
};


export default function EngagementDashboard({ engagementHistory, setEngagementHistory, stream, isCameraOn }: EngagementDashboardProps) {
  const [engagementLevel, setEngagementLevel] = useState<keyof EngagementHistory | 'determining' | 'error'>("determining");
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

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
            } finally {
              setIsDetecting(false);
            }
          }
        }, 5000); // Check engagement every 5 seconds
    }

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current)
    };
  }, [isDetecting, setEngagementHistory, isCameraOn, stream]);

  const CurrentIcon = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].icon : AlertCircle;
  const currentColor = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].color : 'text-gray-500';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="relative w-20 h-12 rounded-md overflow-hidden border bg-black">
              <video ref={videoRef} autoPlay muted playsInline className={cn("w-full h-full object-cover", {"hidden": !isCameraOn})} />
              {!isCameraOn && <div className="w-full h-full flex items-center justify-center"><VideoOff className="w-6 h-6 text-muted-foreground" /></div>}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            {isCameraOn ? (
              <div className="flex items-center gap-2">
                 <CurrentIcon className={cn("w-6 h-6", currentColor)} />
                 <Badge variant={isDetecting ? "secondary" : "outline"} className="capitalize">
                   {isDetecting ? '...' : engagementLevel}
                </Badge>
              </div>
            ) : <Badge variant="secondary">Off</Badge>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your Engagement Monitor</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
