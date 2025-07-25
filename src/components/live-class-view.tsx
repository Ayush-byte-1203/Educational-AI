
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageSquare,
  PhoneOff,
  HeartPulse,
  Bot,
} from "lucide-react";
import type { EngagementHistory } from "@/lib/types";
import EngagementDashboard from "@/components/engagement-dashboard";
import AIChat from "./ai-chat";
import { cn } from "@/lib/utils";
import ParticipantsPanel from "./participants-panel";
import { useToast } from "@/hooks/use-toast";
import EngagementPanel from "./engagement-panel";
import ClassChatPanel from "./class-chat-panel";

export default function LiveClassView() {
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [sidebarView, setSidebarView] = useState<"participants" | "aiChat" | "classChat" | "engagement" | "none">("classChat");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const [currentEngagement, setCurrentEngagement] = useState<keyof EngagementHistory | 'determining' | 'error'>("determining");

  useEffect(() => {
    const getCameraPermission = async () => {
      if (isCameraOn) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(newStream);
        } catch (error) {
          console.error("Error accessing camera:", error);
          setIsCameraOn(false);
          setStream(null);
          toast({
            variant: "destructive",
            title: "Camera Error",
            description: "Could not access webcam. Please check permissions.",
          });
        }
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    };

    getCameraPermission();
    
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn]);


  return (
    <div className="flex h-[calc(100vh-120px)] bg-muted/30 rounded-lg overflow-hidden">
      {/* Main Content: Video Feed */}
      <div className="flex-1 flex flex-col">
        {/* Teacher's Video */}
        <div className="flex-grow bg-black relative">
           <Image
            src="https://placehold.co/1280x720.png"
            alt="Teacher's video feed"
            fill
            objectFit="cover"
            data-ai-hint="lesson lecture"
          />
           <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium">
            Dr. Smith - Biology
          </div>
        </div>
        
        {/* Control Bar */}
        <div className="bg-card p-3 flex justify-between items-center border-t">
          <div className="flex items-center gap-2">
             <EngagementDashboard
              isCameraOn={isCameraOn}
              engagementLevel={currentEngagement}
            />
          </div>
          <div className="flex items-center gap-3">
             <Button variant={isMicOn ? "secondary" : "destructive"} size="icon" onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button variant={isCameraOn ? "secondary" : "destructive"} size="icon" onClick={() => setIsCameraOn(!isCameraOn)}>
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
            <Button variant={sidebarView === 'engagement' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'engagement' ? 'none' : 'engagement')}>
                <HeartPulse />
            </Button>
            <Button variant={sidebarView === 'participants' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'participants' ? 'none' : 'participants')}>
              <Users />
            </Button>
            <Button variant={sidebarView === 'classChat' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'classChat' ? 'none' : 'classChat')}>
              <MessageSquare />
            </Button>
            <Button variant={sidebarView === 'aiChat' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'aiChat' ? 'none' : 'aiChat')}>
              <Bot />
            </Button>
          </div>
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="destructive" className="gap-2">
                <PhoneOff />
                Leave
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
       <div className={cn("w-[380px] bg-card flex flex-col border-l transition-all duration-300", sidebarView === 'none' ? 'w-0 p-0 border-none' : 'w-[380px] p-4')}>
        {sidebarView === "participants" && <ParticipantsPanel />}
        {sidebarView === "aiChat" && <AIChat />}
        {sidebarView === "classChat" && <ClassChatPanel />}
        {sidebarView === "engagement" && (
            <EngagementPanel
                stream={stream}
                isCameraOn={isCameraOn}
                engagementHistory={engagementHistory}
                setEngagementHistory={setEngagementHistory}
                setEngagementLevel={setCurrentEngagement}
            />
        )}
      </div>
    </div>
  );
}
