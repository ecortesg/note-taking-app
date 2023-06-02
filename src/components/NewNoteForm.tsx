import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./Button";
import { api } from "~/utils/api";

type NewNoteFormProps = {
  closeModal: () => void;
  searchParam: string;
};

export function NewNoteForm({ closeModal, searchParam }: NewNoteFormProps) {
  const [newInputValues, setNewInputValues] = useState({
    source: "",
    content: "",
  });
  const trpcUtils = api.useContext();

  const createNote = api.note.create.useMutation({
    onSuccess: (createdNote) => {
      if (
        createdNote.source.toLowerCase().includes(searchParam.toLowerCase()) ||
        createdNote.content.toLowerCase().includes(searchParam.toLowerCase())
      ) {
        // Update data inplace if createdNote contains searchParam
        trpcUtils.note.infiniteFeed.setInfiniteData(
          { searchParam },
          (oldData) => {
            if (oldData == null || oldData.pages[0] == null) return;
            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  notes: [createdNote, ...oldData.pages[0].notes],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        );
      }
    },
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewInputValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createNote.mutate(newInputValues);
    closeModal();
    setNewInputValues({ source: "", content: "" });
  }

  function handleCancel() {
    closeModal();
    setNewInputValues({ source: "", content: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      <div>
        <h1 className="text-2xl font-semibold">New Note</h1>
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
          value={newInputValues.source}
          onChange={handleChange}
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
          value={newInputValues.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex justify-end gap-2">
        <Button color="gray" onClick={handleCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
