import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

type ResponseDisplayProps = {
  response: string | undefined | null;
  isLoading: boolean;
};

export default function ResponseDisplay({ response, isLoading }: ResponseDisplayProps) {
  return (
    <Card className="flex-grow flex flex-col overflow-y-auto">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="w-6 h-6" />
            AI Assistant Response
        </CardTitle>
        <CardDescription>The AI's answer will appear below.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="min-h-[200px] p-4 border rounded-md bg-muted/50">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          )}
          {!isLoading && !response && (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Ready to help. Ask me anything!</p>
            </div>
          )}
          {response && <p className="whitespace-pre-wrap">{response}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
