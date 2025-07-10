
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, GraduationCap, CalendarCheck, ClipboardList, ArrowRight, Bot, Video, Radio } from "lucide-react";
import { Progress } from './ui/progress';

const subjects = [
  { name: "Mathematics", teacher: "Mr. Davison", progress: 85, color: "bg-blue-500" },
  { name: "History", teacher: "Ms. Anya", progress: 72, color: "bg-orange-500" },
  { name: "Science", teacher: "Dr. Smith", progress: 65, color: "bg-green-500" },
  { name: "English", teacher: "Mrs. Gable", progress: 91, color: "bg-purple-500" },
  { name: "Art", teacher: "Mr. Hues", progress: 88, color: "bg-pink-500" },
];

const assignments = [
  { title: "Algebra Homework 5", subject: "Mathematics", due: "Tomorrow" },
  { title: "WWII Essay", subject: "History", due: "3 days" },
  { title: "Lab Report: Photosynthesis", subject: "Science", due: "1 week" },
];

const classes = [
    { name: "Biology", teacher: "Dr. Smith", time: "10:00 AM", isLive: true },
    { name: "Geometry", teacher: "Mr. Davison", time: "11:30 AM", isLive: false },
    { name: "Literature", teacher: "Mrs. Gable", time: "1:00 PM", isLive: false },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto">
      <div className="grid gap-8">

        <Card className="bg-primary/10 border-primary/20 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-x-6">
                <div className="flex items-center gap-6">
                    <Bot className="w-12 h-12 text-primary"/>
                    <div className="space-y-1.5">
                        <CardTitle className="font-headline text-2xl text-primary">
                            Welcome to your AI Classroom Companion
                        </CardTitle>
                        <CardDescription className="text-primary/80 max-w-2xl">
                            Need help with homework? Want to understand a concept better? Your AI assistant is here to help you excel.
                        </CardDescription>
                    </div>
                </div>
                <Link href="/ai-companion">
                    <Button size="lg">
                        Ask AI <ArrowRight className="ml-2"/>
                    </Button>
                </Link>
            </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3">
                <Video className="text-primary"/> Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {classes.map((c) => (
                    <Card key={c.name} className={`flex items-center justify-between p-4 rounded-lg ${c.isLive ? 'bg-primary/10 border-primary/20' : 'bg-muted/50'}`}>
                        <div>
                            <p className="font-semibold text-primary-foreground/90">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.teacher}</p>
                        </div>
                        {c.isLive ? (
                            <Link href="/live-class">
                                <Button size="sm">
                                    <Radio className="mr-2 h-4 w-4 animate-pulse"/>
                                    Join Live
                                </Button>
                            </Link>
                        ) : (
                            <div className="text-sm font-medium text-muted-foreground">{c.time}</div>
                        )}
                    </Card>
                ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3">
                <Book className="text-primary" /> Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.progress}%</p>
                  </div>
                  <Progress value={subject.progress} />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3">
                <ClipboardList className="text-primary"/> Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assignments.map(item => (
                    <li key={item.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                        <div className="text-sm font-medium text-right text-muted-foreground">Due: <span className="font-semibold text-foreground">{item.due}</span></div>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
