import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">
          Classroom AI Companion
        </h1>
      </div>
    </header>
  );
}
