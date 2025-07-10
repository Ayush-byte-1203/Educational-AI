
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

const participants = [
  { name: "Dr. Smith", role: "Host", avatar: "DS" },
  { name: "You", role: "Student", avatar: "ME" },
  { name: "Alice Johnson", role: "Student", avatar: "AJ" },
  { name: "Bob Williams", role: "Student", avatar: "BW" },
  { name: "Charlie Brown", role: "Student", avatar: "CB" },
  { name: "Diana Miller", role: "Student", avatar: "DM" },
  { name: "Ethan Garcia", role: "Student", avatar: "EG" },
];

export default function ParticipantsPanel() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users />
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto">
        {participants.map((p) => (
          <div key={p.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40.png?text=${p.avatar}`} />
                <AvatarFallback>{p.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.role}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
