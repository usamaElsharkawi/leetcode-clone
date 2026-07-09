import { getAllSubmissionByCurrentUserForProblem } from "@/lib/data/problems";
import { useEffect, useState } from "react";

interface Submission {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: any;
  language: string;
  stdin: string | null;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory: string | null;
  time: string | null;
  createdAt: Date;
}

export function useSubmissionHistory(id:string){
     const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);


     useEffect(()=>{
        const fetchSubmissionHistory  = async()=>{
            try {
                const response = await getAllSubmissionByCurrentUserForProblem(id);
                if(response.success){
                      setSubmissionHistory(response.data || []);
                }
            } catch (error) {
                 console.error('Error fetching submission history:', error);
            }
        }

        fetchSubmissionHistory()
     },[id])

     return {
        submissionHistory
     }
}
