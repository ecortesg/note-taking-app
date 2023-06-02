import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "~/components/Button";
import { DeleteNoteForm } from "~/components/DeleteNoteForm";
import { EditNoteForm } from "~/components/EditNoteForm";
import { InfiniteNoteList } from "~/components/InfiniteNoteList";
import { NewNoteForm } from "~/components/NewNoteForm";
import { RandomNoteList } from "~/components/RandomNoteList";
import { api } from "~/utils/api";

export function AppPage() {
  const TABS = ["Review", "Browse"] as const;
  const ACTIONS = ["Create", "Update", "Delete"] as const;
  const [selectedAction, setSelectedAction] =
    useState<(typeof ACTIONS)[number]>("Create");
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Review");
  const [inputValues, setInputValues] = useState({
    id: "",
    source: "",
    content: "",
  });
  const [itemsNum, seti] = useState(5);
  const [searchParam, setSearchParam] = useState("");
  const [randomInt, setRandomInt] = useState(
    Math.floor(Math.random() * 1000000)
  );
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function openModal(action: (typeof ACTIONS)[number]) {
    setSelectedAction(action);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  }

  function handlePrefilledValues(values: {
    id: string;
    source: string;
    content: string;
  }) {
    setInputValues(values);
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const input = target[0] as HTMLInputElement;
    setSearchParam(input.value);
  }

  function changeRandomInt() {
    setRandomInt(Math.floor(Math.random() * 1000000));
  }

  function handlei(e: ChangeEvent<HTMLSelectElement>) {
    seti(parseInt(e.target.value));
  }

  return (
    <section className="flex-grow p-4">
      <div className="flex">
        {TABS.map((tab) => {
          return (
            <button
              key={tab}
              className={`flex-grow px-4 py-2 ${
                tab === selectedTab
                  ? "border-b-4 border-b-blue-500 font-bold"
                  : "border-b hover:bg-gray-200 focus-visible:bg-gray-200"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
        <dialog ref={dialogRef} className="w-full rounded md:w-1/2">
          {selectedAction === "Create" && (
            <NewNoteForm closeModal={closeModal} searchParam={searchParam} />
          )}
          {selectedAction === "Update" && (
            <EditNoteForm
              closeModal={closeModal}
              inputValues={inputValues}
              handleInputChange={handleInputChange}
              searchParam={searchParam}
              selectedTab={selectedTab}
            />
          )}
          {selectedAction === "Delete" && (
            <DeleteNoteForm
              closeModal={closeModal}
              inputValues={inputValues}
              searchParam={searchParam}
              selectedTab={selectedTab}
            />
          )}
        </dialog>
      </div>
      {selectedTab === "Review" && (
        <>
          <div className="flex justify-between gap-4 py-8">
            <div className="flex items-center gap-2">
              <label htmlFor="num-items">Show</label>
              <select
                id="num-items"
                className="rounded border px-2 py-1"
                onChange={(e) => handlei(e)}
                value={itemsNum}
              >
                {[...Array(15).keys()].map((i) => {
                  return (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>
            </div>
            <Button onClick={() => changeRandomInt()}>Refetch</Button>
          </div>
          <RandomNotes
            openModal={openModal}
            handleInputChange={handleInputChange}
            handlePrefilledValues={handlePrefilledValues}
            randomInt={randomInt}
            itemsNum={itemsNum}
          />
        </>
      )}
      {selectedTab === "Browse" && (
        <>
          <div className="flex justify-between gap-4 py-8">
            <form onSubmit={handleSearch} className="max-w-3/4 flex gap-2">
              <input className="w-full rounded border px-2" type="text" />
              <Button type="submit">Filter</Button>
            </form>
            <div className="flex">
              <Button onClick={() => openModal("Create")}>New</Button>
            </div>
          </div>
          <RecentNotes
            openModal={openModal}
            handleInputChange={handleInputChange}
            handlePrefilledValues={handlePrefilledValues}
            searchParam={searchParam}
          />
        </>
      )}
    </section>
  );
}

type NotesProps = {
  openModal: (action: "Create" | "Update" | "Delete") => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handlePrefilledValues: (values: {
    id: string;
    source: string;
    content: string;
  }) => void;
};

function RecentNotes({
  openModal,
  handlePrefilledValues,
  searchParam,
}: NotesProps & { searchParam: string }) {
  const notes = api.note.infiniteFeed.useInfiniteQuery(
    { searchParam },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <InfiniteNoteList
      notes={notes.data?.pages.flatMap((page) => page.notes)}
      isError={notes.isError}
      isLoading={notes.isLoading}
      hasMore={notes.hasNextPage}
      fetchNewNotes={notes.fetchNextPage}
      openModal={openModal}
      handlePrefilledValues={handlePrefilledValues}
    />
  );
}

type Note = {
  id: string;
  source: string;
  content: string;
  createdAt: Date;
};

function RandomNotes({
  openModal,
  handlePrefilledValues,
  randomInt,
  itemsNum,
}: NotesProps & { randomInt: number; itemsNum: number }) {
  const notes = api.note.randomFeed.useQuery({ limit: itemsNum, randomInt });

  return (
    <RandomNoteList
      notes={notes.data as Note[] | undefined}
      openModal={openModal}
      handlePrefilledValues={handlePrefilledValues}
      isError={notes.isError}
      isLoading={notes.isLoading}
    />
  );
}
