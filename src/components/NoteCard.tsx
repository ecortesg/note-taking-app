import { VscEdit, VscTrash } from "react-icons/vsc";

type Note = {
  id: string;
  source: string;
  content: string;
  createdAt: Date;
};

type NoteCardProps = Note & {
  handlePrefilledValues: (values: {
    id: string;
    source: string;
    content: string;
  }) => void;
  openModal: (action: "Create" | "Update" | "Delete") => void;
};

export function NoteCard({
  id,
  source,
  content,
  createdAt,
  openModal,
  handlePrefilledValues,
}: NoteCardProps) {
  const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });

  function openEditModal(values: {
    id: string;
    source: string;
    content: string;
  }) {
    handlePrefilledValues(values);
    openModal("Update");
  }

  function openDeleteModal(values: {
    id: string;
    source: string;
    content: string;
  }) {
    handlePrefilledValues(values);
    openModal("Delete");
  }

  return (
    <li className="flex border-b p-4">
      <div className="flex flex-grow flex-col gap-2">
        <div>
          <p className="font-semibold">{source}</p>
          <p className="text-sm text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </p>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="mt-2 flex justify-end gap-3">
          <VscEdit
            className="cursor-pointer text-gray-500"
            onClick={() => openEditModal({ id, source, content })}
          />
          <VscTrash
            className="cursor-pointer text-gray-500"
            onClick={() => openDeleteModal({ id, source, content })}
          />
        </div>
      </div>
    </li>
  );
}
