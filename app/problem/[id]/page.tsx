"use client";

import { useParams } from "next/navigation";
import { useProblem } from "@/hooks/use-problem";
import { Spinner } from "@/components/ui/spinner";
import { ProblemHeader } from "@/modules/problems/component/problem-header";
import { ProblemDescription } from "@/modules/problems/component/problem-description";
import { ProblemTabs } from "@/modules/problems/component/problem-tabs";
import { useEditor } from "@/modules/problems/hooks/use-editor";
import CodeEditorPanel from "@/modules/problems/component/code-editor-panel";
import TestCasesPanel from "@/modules/problems/component/testcases-panel";
import { ExecutionResults } from "@/modules/problems/component/execution-results";
import { useSubmissionHistory } from "@/modules/problems/hooks/use-submission-history";

function ProblemIdPage() {
  const params = useParams<{ id: string }>();
  const { problem, isLoading } = useProblem(params.id);
  const {submissionHistory} = useSubmissionHistory(params.id)

  const {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  } = useEditor(problem);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  const id = params.id;
  console.log(id);
  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-7xl mx-auto p-6">
        <ProblemHeader problem={problem} />
        <div className="grid lg:grid-cols-2 gap-6">
          {/* left panel with problem description*/}
          <div className="space-y-6">
            <ProblemDescription
              problem={problem}
              selectedLanguage={"JAVASCRIPT"}
            />
            <ProblemTabs problem={problem} submissionHistory={submissionHistory}/>
          </div>
          {/* right panel with code editor and submission panel*/}
          <div className="space-y-6">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />

            <TestCasesPanel testCases={problem?.testCases} />

            <ExecutionResults executionResponse={executionResponse}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemIdPage;
