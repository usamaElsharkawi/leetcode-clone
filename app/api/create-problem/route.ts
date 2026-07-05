import { getCurrentUserData } from "@/lib/data/user";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import { getJudge0languages, pollBatchResult, submitBatch } from "@/lib/judge0";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ── Auth gate ────────────────────────────────────────────────────────────
    // One query gives us both the user record and the role.
    // The null guard covers: unauthenticated, user not in DB, and non-admin.
    const userData = await getCurrentUserData();

    if (!userData || userData.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Body validation ──────────────────────────────────────────────────────
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = await request.json();

    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 },
      );
    }

    // ── Judge0 validation gate ───────────────────────────────────────────────
    // Run every reference solution against all test cases.
    // If any test case fails, reject the problem before touching the DB.
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0languages(language);

      const submissions = testCases.map(({ input, output }) => ({
        source_code: Buffer.from(solutionCode as string).toString("base64"),
        language_id: languageId,
        stdin: Buffer.from(input).toString("base64"),
        expected_output: Buffer.from(output).toString("base64"),
      }));

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((res: any) => res.token);
      const results = await pollBatchResult(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: Buffer.from(submissions[i].stdin, "base64").toString("utf-8"),
                expectedOutput: Buffer.from(submissions[i].expected_output, "base64").toString("utf-8"),
                actualOutput: result.stdout ? Buffer.from(result.stdout, "base64").toString("utf-8") : null,
                error: result.stderr 
                  ? Buffer.from(result.stderr, "base64").toString("utf-8") 
                  : (result.compile_output ? Buffer.from(result.compile_output, "base64").toString("utf-8") : null),
              },
              details: result,
            },
            { status: 400 },
          );
        }
      }
    }

    // ── Persistence ──────────────────────────────────────────────────────────
    // userId comes from the server-side auth call — never from the request body.
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: userData.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error) {
    // Surface the actual error message — covers Judge0 failures, DB errors,
    // and poll timeouts with a precise description instead of a generic one.
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[create-problem]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
