import { api } from "~/utils/api";
import { Button } from "./Button";
import { FormEvent } from "react";

type DeleteNoteFormProps = {
  closeModal: () => void;
  inputValues: { id: string; source: string; content: string };
  searchParam: string;
  selectedTab: string;
};

export function DeleteNoteForm({
  closeModal,
  inputValues,
  searchParam,
  selectedTab,
}: DeleteNoteFormProps) {
  const trpcUtils = api.useContext();

  const deleteNote = api.note.delete.useMutation({
    onSuccess: async (deletedNote) => {
      if (selectedTab === "Review") {
        await trpcUtils.note.randomFeed.invalidate();
      } else {
        // Update data inplace whenever a note is deleted
        trpcUtils.note.infiniteFeed.setInfiniteData(
          { searchParam },
          (oldData) => {
            if (oldData == null || oldData.pages[0] == null) return;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  notes: page.notes.filter(
                    (note) => note.id !== deletedNote.id
                  ),
                };
              }),
            };
          }
        );
      }
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    deleteNote.mutate({ id: inputValues.id });
    closeModal();
  }

  function handleCancel() {
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      <div>
        <h1 className="text-2xl font-semibold">Delete Note</h1>
        <hr />
      </div>
      <p>Are you sure you want to delete this item?</p>
      <div className="flex justify-end gap-2">
        <Button color="gray" onClick={handleCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" color="red">
          Delete
        </Button>
      </div>
    </form>
  );
}
