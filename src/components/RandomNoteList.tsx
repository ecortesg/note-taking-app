import { LoadingSpinner } from "./LoadingSpinner";
import { NoteCard } from "./NoteCard";

type Note = {
  id: string;
  source: string;
  content: string;
  createdAt: Date;
};

type RandomNoteListProps = {
  notes?: Note[];
  isLoading: boolean;
  isError: boolean;
  openModal: (action: "Create" | "Update" | "Delete") => void;
  handlePrefilledValues: (values: {
    id: string;
    source: string;
    content: string;
  }) => void;
};

export function RandomNoteList({
  notes,
  openModal,
  handlePrefilledValues,
  isLoading,
  isError,
}: RandomNoteListProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (notes == null || notes.length === 0) {
    return <h2 className="my-4 text-center text-xl text-gray-500">No Notes</h2>;
  }

  return (
    <ul className="border-x border-t">
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
    </ul>
  );
}
