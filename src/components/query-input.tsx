"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Mic, Send, StopCircle, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type QueryInputProps = {
  onSubmit: (textQuery?: string, voiceDataUri?: string, imageDataUri?: string) => void;
  isGenerating: boolean;
};

export default function QueryInput({ onSubmit, isGenerating }: QueryInputProps) {
  const [text, setText] = useState("");
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [voiceDataUri, setVoiceDataUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setVoiceDataUri(reader.result as string);
        };
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop()); // Stop the mic
      };
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not start recording. Please check permissions."
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageDataUri(reader.result as string);
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, voiceDataUri ?? undefined, imageDataUri ?? undefined);
    // Do not clear inputs until generation is complete.
  };
  
  const clearImage = () => setImageDataUri(null);
  const clearVoice = () => setVoiceDataUri(null);

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Textarea
              placeholder="Ask a question, describe an image, or use your voice..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="pr-24"
              rows={3}
              disabled={isGenerating}
            />
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || !!imageDataUri}
                aria-label="Upload Image"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              {isRecording ? (
                <Button type="button" variant="destructive" size="icon" onClick={handleStopRecording} aria-label="Stop Recording">
                  <StopCircle className="w-5 h-5" />
                </Button>
              ) : (
                <Button type="button" variant="outline" size="icon" onClick={handleStartRecording} disabled={isGenerating || !!voiceDataUri} aria-label="Record Voice">
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className="flex-grow flex items-center gap-2">
              {imageDataUri && (
                <div className="relative h-10 w-16 rounded border p-1">
                  <Image src={imageDataUri} alt="Uploaded preview" layout="fill" objectFit="cover" className="rounded" />
                  <button onClick={clearImage} className="absolute -top-2 -right-2 bg-secondary rounded-full p-0.5 border"><X className="w-3 h-3"/></button>
                </div>
              )}
              {voiceDataUri && (
                <div className="relative flex items-center gap-2 h-10 rounded border p-2 bg-muted">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Voice note added</span>
                    <button onClick={clearVoice} className="absolute -top-2 -right-2 bg-secondary rounded-full p-0.5 border"><X className="w-3 h-3"/></button>
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={isGenerating || (!text && !imageDataUri && !voiceDataUri)} className="min-w-[100px]">
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
