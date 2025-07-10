
"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";

const initialMessages = [
    { id: nanoid(), text: "Hello everyone, welcome to Biology!", sender: "Dr. Smith", avatar: "DS", timestamp: "10:01 AM" },
    { id: nanoid(), text: "Hi Dr. Smith!", sender: "Alice Johnson", avatar: "AJ", timestamp: "10:01 AM" },
    { id: nanoid(), text: "Good morning!", sender: "Bob Williams", avatar: "BW", timestamp: "10:02 AM" },
    { id: nanoid(), text: "Today we are covering chapter 5 on photosynthesis.", sender: "Dr. Smith", avatar: "DS", timestamp: "10:03 AM" },
];

export default function ClassChatPanel() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        const message = {
            id: nanoid(),
            text: newMessage,
            sender: "You",
            avatar: "ME",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, message]);
        setNewMessage("");
    };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare />
          Class Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`https://placehold.co/32x32.png?text=${msg.avatar}`} />
              <AvatarFallback>{msg.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <p className="font-semibold text-sm">{msg.sender}</p>
                <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
