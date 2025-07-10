"use client";

import { useState } from "react";
import type { EngagementHistory } from "@/lib/types";
import EngagementDashboard from "@/components/engagement-dashboard";
import AIChat from "./ai-chat";

export default function AICompanionView() {
  const [engagementHistory, setEngagementHistory] = useState<EngagementHistory>({
    engaged: 0,
    neutral: 0,
    disengaged: 0,
    confused: 0,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-6">
        <AIChat />
      </div>
      <div className="flex flex-col gap-6">
        <EngagementDashboard
          engagementHistory={engagementHistory}
          setEngagementHistory={setEngagementHistory}
        />
      </div>
    </div>
  );
}
