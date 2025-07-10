"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { detectEngagement } from "@/ai/flows/detect-engagement";
import type { EngagementHistory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

type EngagementDashboardProps = {
  engagementHistory: EngagementHistory;
  setEngagementHistory: React.Dispatch<React.SetStateAction<EngagementHistory>>;
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
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUri = canvas.toDataURL("image/jpeg");

        try {
          const { engagementLevel, suggestedIntervention } = await detectEngagement({ photoDataUri });
          setEngagementLevel(engagementLevel);
          setSuggestedIntervention(suggestedIntervention);
          const levelKey = engagementLevel.toLowerCase() as keyof EngagementHistory;
          if (levelKey in engagementHistory) {
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


  const chartData = Object.entries(engagementHistory).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Video className="w-6 h-6" />
          Engagement Monitor
        </CardTitle>
        <CardDescription>Real-time student engagement analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="font-semibold">Status:</div>
          <div className="flex justify-end">
            <Badge variant={isDetecting ? "secondary" : "default"}>{engagementLevel}</Badge>
          </div>
        </div>
        {suggestedIntervention && (
          <div className="text-sm p-3 bg-accent/20 border border-accent/50 rounded-md">
            <p className="font-semibold text-accent-foreground/80">Suggestion:</p>
            <p className="text-accent-foreground">{suggestedIntervention}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold mb-2">Engagement History</h4>
          <div className="h-[150px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
