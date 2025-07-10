
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { EngagementHistory } from "@/lib/types";
import { Smile, Frown, Meh, Brain, AlertCircle, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type EngagementDashboardProps = {
  isCameraOn: boolean;
  engagementLevel: keyof EngagementHistory | 'determining' | 'error';
};

const engagementMeta = {
    engaged: { icon: Smile, color: 'text-green-500' },
    neutral: { icon: Meh, color: 'text-blue-500' },
    disengaged: { icon: Frown, color: 'text-red-500' },
    confused: { icon: Brain, color: 'text-yellow-500' },
};


export default function EngagementDashboard({ isCameraOn, engagementLevel }: EngagementDashboardProps) {

  const CurrentIcon = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].icon : AlertCircle;
  const currentColor = engagementLevel in engagementMeta ? engagementMeta[engagementLevel as keyof EngagementHistory].color : 'text-gray-500';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="relative w-20 h-12 rounded-md overflow-hidden border bg-black flex items-center justify-center">
              {!isCameraOn ? 
                <VideoOff className="w-6 h-6 text-muted-foreground" /> :
                <CurrentIcon className={cn("w-8 h-8", currentColor)} />
              }
            </div>
            {isCameraOn ? (
              <div className="flex items-center gap-2">
                 <Badge variant={"outline"} className="capitalize">
                   {engagementLevel}
                </Badge>
              </div>
            ) : <Badge variant="secondary">Off</Badge>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your Engagement Monitor</p>
          <p className="text-xs text-muted-foreground">Open Engagement Panel for details.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
