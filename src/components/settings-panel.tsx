"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Settings } from "@/lib/types";
import { SlidersHorizontal } from "lucide-react";

type SettingsPanelProps = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

export default function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6" />
            Model Parameters
        </CardTitle>
        <CardDescription>Adjust the AI response style</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <div className="space-y-3">
          <Label htmlFor="verbosity">Verbosity</Label>
          <Slider
            id="verbosity"
            min={1}
            max={10}
            step={1}
            value={[settings.verbosity]}
            onValueChange={([value]) => setSettings(s => ({ ...s, verbosity: value }))}
          />
          <p className="text-xs text-muted-foreground">Controls how talkative the AI is.</p>
        </div>
        <div className="space-y-3">
          <Label htmlFor="depth">Depth</Label>
          <Slider
            id="depth"
            min={1}
            max={10}
            step={1}
            value={[settings.depth]}
            onValueChange={([value]) => setSettings(s => ({ ...s, depth: value }))}
          />
           <p className="text-xs text-muted-foreground">Controls the complexity of the explanation.</p>
        </div>
      </CardContent>
    </Card>
  );
}
