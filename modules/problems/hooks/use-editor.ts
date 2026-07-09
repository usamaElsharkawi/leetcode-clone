'use client';
import { executeCode } from "@/lib/data/problems";
import { getJudge0languages } from "@/lib/judge0";
import { useState,useEffect } from "react";
import { toast } from "sonner";

export function useEditor(problem: any, initialLanguage = "JAVASCRIPT") {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState<any>(null);

  useEffect(()=>{
    if(problem?.codeSnippets?.[selectedLanguage]) {
     setCode(problem.codeSnippets[selectedLanguage]);
    }
  },[selectedLanguage,problem])

  const handleRun=() => {

    
  }

  const handleSubmit = async () => {
    if (!problem) return;

    try {
      setIsSubmitting(true);
      const language_id = getJudge0languages(selectedLanguage);
      const stdin = problem.testCases.map((tc: any) => tc.input);
      const expected_outputs = problem.testCases.map((tc: any) => tc.output);

      const res = await executeCode(code , language_id , stdin , expected_outputs , problem.id);
      setExecutionResponse(res as any);

      if(res.success){
        toast.success("Code executed successfully")
      }
    } catch (error) {
       console.error('Error executing code', error);
      toast.error('Error executing code');
    }
    finally{
      setIsSubmitting(false)
    }
  };

return{
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
}
}

