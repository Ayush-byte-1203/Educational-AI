
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, GraduationCap, CalendarCheck, ClipboardList, ArrowRight, Bot, Video, Radio } from "lucide-react";
import { Progress } from './ui/progress';

const subjects = [
  { name: "Mathematics", teacher: "Mr. Davison", progress: 85 },
  { name: "History", teacher: "Ms. Anya", progress: 72 },
  { name: "Science", teacher: "Dr. Smith", progress: 65 },
  { name: "English", teacher: "Mrs. Gable", progress: 91 },
  { name: "Art", teacher: "Mr. Hues", progress: 88 },
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
      <div className="grid gap-6">

        <Card className="bg-primary/10 border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                        <Bot className="w-8 h-8"/>
                        Welcome to your AI Classroom Companion
                    </CardTitle>
                    <CardDescription className="text-primary/80">
                        Need help with homework? Want to understand a concept better? Your AI assistant is here to help.
                    </CardDescription>
                </div>
                <Link href="/ai-companion">
                    <Button>
                        Ask AI <ArrowRight className="ml-2"/>
                    </Button>
                </Link>
            </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Video /> Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {classes.map((c) => (
                    <Card key={c.name} className={`flex items-center justify-between p-3 ${c.isLive ? 'bg-primary/10' : 'bg-muted/50'}`}>
                        <div>
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.teacher}</p>
                        </div>
                        {c.isLive ? (
                            <Link href="/live-class">
                                <Button size="sm">
                                    <Radio className="mr-2 animate-pulse"/>
                                    Join Live
                                </Button>
                            </Link>
                        ) : (
                            <div className="text-sm font-medium">{c.time}</div>
                        )}
                    </Card>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Book /> Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <GraduationCap /> Grades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-baseline justify-center p-4">
                    <p className="text-6xl font-bold text-primary">A-</p>
                    <p className="text-lg text-muted-foreground">Overall GPA</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="font-semibold">92%</p>
                        <p className="text-sm text-muted-foreground">Mathematics</p>
                    </div>
                    <div>
                        <p className="font-semibold">88%</p>
                        <p className="text-sm text-muted-foreground">History</p>
                    </div>
                    <div>
                        <p className="font-semibold">85%</p>
                        <p className="text-sm text-muted-foreground">Science</p>
                    </div>
                    <div>
                        <p className="font-semibold">95%</p>
                        <p className="text-sm text-muted-foreground">English</p>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <CalendarCheck /> Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-2">
                <div className="text-6xl font-bold text-green-500">98%</div>
                <p className="text-muted-foreground">34/35 Days Present</p>
                <Button variant="outline" size="sm">Report Absence</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ClipboardList /> Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assignments.map(item => (
                    <li key={item.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                        <div className="text-sm font-medium text-right">Due: {item.due}</div>
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
