
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";
import type { EngagementHistory } from "@/lib/types";
import EngagementDashboard from "@/components/engagement-dashboard";
import AIChat from "./ai-chat";

export default function LiveClassView() {
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4 h-[calc(100vh-120px)]">
      
      {/* Main Content: Video + Chat */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
        
        {/* Teacher's Video */}
        <Card className="flex-grow relative overflow-hidden">
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
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button variant="secondary" size="icon" className="bg-black/50 hover:bg-black/70">
              <Maximize />
            </Button>
          </div>
        </Card>

        {/* AI Chat */}
        <div className="hidden xl:block h-[350px]">
          <AIChat />
        </div>
      </div>

      {/* Sidebar: Student Video, Engagement, Chat (on smaller screens) */}
      <div className="flex flex-col gap-6">
        <EngagementDashboard
          engagementHistory={engagementHistory}
          setEngagementHistory={setEngagementHistory}
        />
        <div className="xl:hidden">
            <AIChat />
        </div>
      </div>
    </div>
  );
}
