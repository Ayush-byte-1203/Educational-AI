import Header from "@/components/header";
import LiveClassView from "@/components/live-class-view";

export default function LiveClassPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <LiveClassView />
      </main>
    </div>
  );
}
