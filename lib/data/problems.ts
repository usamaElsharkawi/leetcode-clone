"use server";

import { prisma } from "../db";
import { submitBatch, pollBatchResult } from "../judge0";
import { getCurrentUserData } from "./user";

const LANGUAGE_NAMES: Record<number, string> = {
  71: "Python",
  102: "JavaScript",
  62: "Java",
};

function getLanguageName(languageId: number): string {
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

interface DetailedResult {
  testCase: number;
  passed: boolean;
  stdout: string | null;
  expected: string;
  stderr: string | null;
  compile_output: string | null;
  status: string;
  memory: string | undefined;
  time: string | undefined;
}

export async function getAllProblems() {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        solveds: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: problems,
    };
  } catch (error) {
    return {
      success: false,
      error: "failed to fetch the problems",
    };
  }
}

export async function gerProblemById(id: string) {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id,
      },
    });
    return {
      success: true,
      data: problem,
    };
  } catch (error) {
    return {
      success: false,
      error: "failed to fetch the problem",
    };
  }
}

export const executeCode = async (
  source_code: string,
  language_id: number,
  stdin: string[],
  expected_outputs: string[],
  id: string,
) => {
  const user = await getCurrentUserData();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return { success: false, error: "Invalid Test Cases" };
  }

  const submissions = stdin.map((input, i) => ({
    source_code,
    language_id,
    stdin: input,
    expected_output: expected_outputs[i],
  }));

  const submitResponse = await submitBatch(submissions);

  const tokens = submitResponse.map((res: any) => res.token);

  const results = await pollBatchResult(tokens);

  let allPassed = true;

  const detailedResults: DetailedResult[] = results.map((result: any, i: number) => {
    const stdout = result.stdout?.trim() || null;
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });


  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      problemId: id,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    },
  });

  if (allPassed) {
    await prisma.problemSolved.upsert({
      where: {
        userId_problemId: { userId: user.id, problemId: id },
      },

      update: {},
      create: {
        userId: user.id,
        problemId: id,
      },
    });
  }

  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    time: result.time,
  }));

  await prisma.testCaseResult.createMany({ data: testCaseResults });

  const submissionWithTestCases = await prisma.submission.findUnique({
    where: { id: submission.id },
    include: {
      testCases: true,
    },
  });

  return {
    success: true,
    submission: submissionWithTestCases,
  };
};





export const getAllSubmissionByCurrentUserForProblem = async (problemId:string)=>{
    try{
      const user = await getCurrentUserData();

      const submission = await prisma.submission.findMany({
        where:{
            userId:user?.id,
            problemId
        }
      })

      return {
        success: true,
        data: submission,
      };
      
    }catch(err){
         console.error(err);

         return {
        success: false,
        error: "failed to fetch the submissions",
      };
    }
}   


