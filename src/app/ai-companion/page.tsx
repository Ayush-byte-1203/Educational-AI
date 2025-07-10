import AICompanionView from '@/components/ai-companion-view';
import Header from "@/components/header";

export default function AIPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center">
        <AICompanionView />
      </main>
    </div>
  )
}
