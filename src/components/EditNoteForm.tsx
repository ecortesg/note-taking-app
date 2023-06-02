import { api } from "~/utils/api";
import { Button } from "./Button";
import { ChangeEvent, FormEvent } from "react";

type EditNoteFormProps = {
  closeModal: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputValues: { id: string; source: string; content: string };
  searchParam: string;
  selectedTab: string;
};

export function EditNoteForm({
  closeModal,
  inputValues,
  handleInputChange,
  searchParam,
  selectedTab,
}: EditNoteFormProps) {
  const trpcUtils = api.useContext();

  const editNote = api.note.edit.useMutation({
    onSuccess: async (updatedNote) => {
      if (selectedTab === "Review") {
        await trpcUtils.note.randomFeed.invalidate();
      } else {
        if (
          updatedNote.source
            .toLowerCase()
            .includes(searchParam.toLowerCase()) ||
          updatedNote.content.toLowerCase().includes(searchParam.toLowerCase())
        ) {
          // Add inplace if note still contains searchParam
          trpcUtils.note.infiniteFeed.setInfiniteData(
            { searchParam },
            (oldData) => {
              if (oldData == null || oldData.pages[0] == null) return;
              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    notes: page.notes.map((note) => {
                      if (note.id !== updatedNote.id) {
                        return note;
                      } else {
                        return {
                          ...note,
                          source: updatedNote.source,
                          content: updatedNote.content,
                        };
                      }
                    }),
                  };
                }),
              };
            }
          );
        } else {
          // Filter out if note no longer contains searchParam
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
                      (note) => note.id !== updatedNote.id
                    ),
                  };
                }),
              };
            }
          );
        }
      }
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    editNote.mutate(inputValues);
    closeModal();
  }

  function handleCancel() {
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      <div>
        <h1 className="text-2xl font-semibold">Edit Note</h1>
        <hr />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="source">Source</label>
        <input
          required
          id="source"
          name="source"
          className="flex-grow rounded border p-2 outline-none"
          type="text"
          value={inputValues.source}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="content">Content</label>
        <textarea
          required
          rows={5}
          id="content"
          name="content"
          className="flex-grow rounded border p-2 outline-none"
          value={inputValues.content}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="flex justify-end gap-2">
        <Button color="gray" onClick={handleCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
