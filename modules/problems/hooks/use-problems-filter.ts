import { useState, useMemo } from "react";

export function useProblemsFilter(problems = []) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");

  //Extract all unique tags from the problem
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    problems.forEach((p: any) => {
      p.tags?.forEach((t: string) => {
        tagSet.add(t);
      });
    });

    return Array.from(tagSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem: any) =>
        problem.title.toLowerCase().includes(search.toLowerCase()),
      )
      .filter(
        (problem: any) =>
          difficulty === "ALL" || problem?.difficulty === difficulty,
      )
      .filter(
        (problem: any) =>
          selectedTag === "ALL" || problem?.tags.includes(selectedTag),
      );
  }, [problems, search, difficulty, selectedTag]);


  return {
    search,
    difficulty,
    selectedTag,
    filteredProblems,
    allTags,
    setSearch,
    setDifficulty,
    setSelectedTag
  }
}
