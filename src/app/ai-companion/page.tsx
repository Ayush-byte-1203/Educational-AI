import ClassroomAICompanion from '@/components/classroom-ai-companion';
import Header from "@/components/header";

export default function AIPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <ClassroomAICompanion />
    </div>
  )
}
