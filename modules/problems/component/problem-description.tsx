import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ExampleSection } from "./example-section";
import { ConstrantSection } from "./constrant-section";

export function ProblemDescription({ problem }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Problem Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-foreground leading-relaxed">
            {problem?.description}
          </p>
          {Object.values(problem?.examples || {}).map((ex: any , idx: number) => {
            return <ExampleSection key={idx} example={ex} index={idx + 1}  />;    
          })}
          <ConstrantSection constraints={problem?.constraints}/>
        </div>
      </CardContent>
    </Card>
  );
}
