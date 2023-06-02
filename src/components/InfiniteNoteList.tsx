import InfiniteScroll from "react-infinite-scroll-component";
import { NoteCard } from "./NoteCard";
import { LoadingSpinner } from "./LoadingSpinner";

type Note = {
  id: string;
  source: string;
  content: string;
  createdAt: Date;
};

type InfiniteNoteListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewNotes: () => Promise<unknown>;
  notes?: Note[];
  openModal: (action: "Create" | "Update" | "Delete") => void;
  handlePrefilledValues: (values: {
    id: string;
    source: string;
    content: string;
  }) => void;
};

export function InfiniteNoteList({
  notes,
  isError,
  isLoading,
  fetchNewNotes,
  hasMore = false,
  openModal,
  handlePrefilledValues,
}: InfiniteNoteListProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (notes == null || notes.length === 0) {
    return <h2 className="my-4 text-center text-xl text-gray-500">No Notes</h2>;
  }

  return (
    <ul className="border-x border-t">
      <InfiniteScroll
        dataLength={notes.length}
        next={fetchNewNotes}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {notes.map((note) => {
          return (
            <NoteCard
              key={note.id}
              {...note}
              openModal={openModal}
              handlePrefilledValues={handlePrefilledValues}
            />
          );
        })}
      </InfiniteScroll>
    </ul>
  );
}
