import { getCurrentUserData } from "@/lib/data/user";
import { getAllProblems } from "@/lib/data/problems";
import { ProblemsTable } from "@/modules/problems/component/problems-table";

async function ProblemPage() {
  const user = await getCurrentUserData();
  const { data:problems, error } = await getAllProblems();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading problems: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-32">
      <ProblemsTable problems={problems} user={user} />
    </div>
  );
}

export default ProblemPage;
