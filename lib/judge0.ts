import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────────────

type Submission = {
  source_code: unknown;
  language_id: number | undefined;
  stdin: string;
  expected_output: string;
};

// ── Constants ──────────────────────────────────────────────────────────────────

// Maximum number of poll attempts before giving up (100 × 100ms = 10 seconds)
const MAX_POLL_ATTEMPTS = 100;

const RAPIDAPI_HOST = "judge0-extra-ce1.p.rapidapi.com";

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getJudge0languages(language: string) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 102,
    JAVA: 62,
  };
  return languageMap[language.toUpperCase() as keyof typeof languageMap];
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── API calls ──────────────────────────────────────────────────────────────────

export async function submitBatch(submissions: Submission[]) {
  const options = {
    method: "POST",
  url: 'https://judge029.p.rapidapi.com/submissions/batch',
    params: { base64_encoded: "false" },
       headers: {
    'x-rapidapi-key': process.env.JUDGE0_API_KEY,
    'x-rapidapi-host': process.env.JUDGE0_API_HOST,
    'Content-Type': 'application/json'
  },

    data: { submissions },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error: any) {
    // Re-throw with context so the caller gets a meaningful message
    throw new Error(`Judge0 batch submission failed: ${error.message}`);
  }
}

export async function pollBatchResult(tokens: string[]) {
  const options = {
    method: "GET",
  url: 'https://judge029.p.rapidapi.com/submissions/batch',
    params: {
      tokens: tokens.join(","),
      base64_encoded: "false",
      fields: "*",
    },
       headers: {
    'x-rapidapi-key': process.env.JUDGE0_API_KEY,
    'x-rapidapi-host': process.env.JUDGE0_API_HOST,
    'Content-Type': 'application/json'
  }
  };

  let attempts = 0;

  while (attempts < MAX_POLL_ATTEMPTS) {
    attempts++;

    const { data } = await axios.request(options);
    const results = data.submissions;

    const isAllDone = results.every(
      (r: any) => r.status.id !== 1 && r.status.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(100);
  }

  throw new Error(
    `Judge0 polling timed out after ${MAX_POLL_ATTEMPTS} attempts`,
  );
}
