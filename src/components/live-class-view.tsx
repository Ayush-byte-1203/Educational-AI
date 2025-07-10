
"use client";

import { useState } from "react";
import Link from 'next/link';
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageSquare,
  PhoneOff,
} from "lucide-react";
import type { EngagementHistory } from "@/lib/types";
import EngagementDashboard from "@/components/engagement-dashboard";
import AIChat from "./ai-chat";
import { cn } from "@/lib/utils";
import ParticipantsPanel from "./participants-panel";

export default function LiveClassView() {
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [sidebarView, setSidebarView] = useState<"participants" | "chat" | "none">("chat");

  return (
    <div className="flex h-[calc(100vh-120px)] bg-muted/30 rounded-lg overflow-hidden">
      {/* Main Content: Video Feed */}
      <div className="flex-1 flex flex-col">
        {/* Teacher's Video */}
        <div className="flex-grow bg-black relative">
           <Image
            src="https://placehold.co/1280x720.png"
            alt="Teacher's video feed"
            layout="fill"
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
              engagementHistory={engagementHistory}
              setEngagementHistory={setEngagementHistory}
            />
          </div>
          <div className="flex items-center gap-3">
             <Button variant={isMicOn ? "secondary" : "destructive"} size="icon" onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button variant={isCameraOn ? "secondary" : "destructive"} size="icon" onClick={() => setIsCameraOn(!isCameraOn)}>
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
            <Button variant={sidebarView === 'participants' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'participants' ? 'none' : 'participants')}>
              <Users />
            </Button>
            <Button variant={sidebarView === 'chat' ? 'default' : 'secondary'} size="icon" onClick={() => setSidebarView(sidebarView === 'chat' ? 'none' : 'chat')}>
              <MessageSquare />
            </Button>
          </div>
          <div className="flex items-center">
            <Link href="/">
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
        {sidebarView === "chat" && <AIChat />}
      </div>
    </div>
  );
}

