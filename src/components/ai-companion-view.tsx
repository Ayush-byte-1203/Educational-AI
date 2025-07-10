
"use client";

import { useState, useEffect } from "react";
import type { EngagementHistory } from "@/lib/types";
import EngagementDashboard from "@/components/engagement-dashboard";
import AIChat from "./ai-chat";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AICompanionView() {
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const getCameraPermission = async () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
    } catch (error) {
        console.error("Error accessing camera:", error);
        setIsCameraOn(false);
        toast({
            variant: "destructive",
            title: "Camera Error",
            description: "Could not access webcam. Please check permissions.",
        });
    }
  };

  useEffect(() => {
    if (isCameraOn) {
      getCameraPermission();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn]);


  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-6">
        <AIChat />
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Video />
                Engagement Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <Switch id="camera-switch" checked={isCameraOn} onCheckedChange={setIsCameraOn} />
                <Label htmlFor="camera-switch">Camera On</Label>
            </div>
            <EngagementDashboard
              engagementHistory={engagementHistory}
              setEngagementHistory={setEngagementHistory}
              stream={stream}
              isCameraOn={isCameraOn}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
