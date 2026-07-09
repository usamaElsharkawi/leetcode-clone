"use client"; //why it is a client component
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useProblemsFilter } from "../../hooks/use-problems-filter";
import { ProblemsHeader } from "./problems-header";
import { ProblemsFilters } from "./problem-filters";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import { usePagination } from "../../hooks/use-pagination";
import { ProblemsPagination } from "./problems-pagination";
import CreatePlaylistModal from "@/modules/playlist/components/create-playlist";
import { usePlaylistActions } from "@/modules/playlist/hooks/use-playlist-action";
import AddToPlaylistModal from "@/modules/playlist/components/add-to-playlist";

export function ProblemsTable({ problems = [], user }: any) {
  const filters = useProblemsFilter(problems);
  const pagination = usePagination(filters.filteredProblems as any[]);
  const playlist = usePlaylistActions();
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ProblemsHeader onCreatePlaylist={playlist.openCreateModal} />

      <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}
      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[120px]">Difficulty</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    onDelete={() => {}}
                    onSave={playlist.openAddToPlaylist}
                  />
                ))
              ) : (
                <ProblemsEmpty />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.showPagination && (
        <ProblemsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          displayRange={pagination.displayRange}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPrevious={pagination.goToPreviousPage}
          onNext={pagination.goToNextPage}
        />
      )}

      <CreatePlaylistModal
        isOpen={playlist.isCreateModalOpen}
        onClose={playlist.closeCreateModal}
        onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModal
      isOpen={playlist.isAddToPlaylistModalOpen}
      onClose={playlist.closeAddToPlaylistModal}
      onSubmit={playlist.handleAddToPlaylist}
      problemId={playlist.selectedProblemId}
      />
    </div>
  );
}
