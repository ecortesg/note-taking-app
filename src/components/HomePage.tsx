import { Button } from "./Button";
import { signIn } from "next-auth/react";
import { VscLightbulb, VscIssueReopened, VscLibrary } from "react-icons/vsc";
import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    headline: "Capture and Organize Your Insights",
    description:
      "Lernote empowers you to capture the knowledge and wisdom that resonates with you. Whether it's a profound quote from a podcast or an enlightening passage from a book, Lernote helps you create and organize your notes effortlessly. Say goodbye to forgotten ideas and hello to a digital sanctuary for your learning journey.",
    icon: <VscLightbulb className="h-8 w-8 text-blue-500" />,
  },
  {
    headline: "Remember with Spaced Repetition",
    description:
      "Lernote's innovative Review section uses the power of spaced repetition to help you retain what you've learned. It randomly selects notes from your database and presents them for optimal memory reinforcement. Enhance your learning process by effortlessly revisiting your notes and reinforcing your understanding.",
    icon: <VscIssueReopened className="h-8 w-8 text-blue-500" />,
  },
  {
    headline: "Seamless Note Management",
    description:
      "With Lernote, note management becomes a breeze. Create new notes, edit existing ones, and delete or filter them with ease. Whether you want to refine your thoughts, add new insights, or remove outdated information, Lernote offers a user-friendly interface designed to simplify your note-taking experience. Spend less time organizing and more time absorbing knowledge.",
    icon: <VscLibrary className="h-8 w-8 text-blue-500" />,
  },
];

export function HomePage() {
  return (
    <>
      <section className="mb-4 flex w-full flex-col items-center justify-between lg:flex-row">
        <div className="flex flex-col gap-6 p-4 text-center lg:text-left">
          <h1 className="text-4xl font-bold">Never Forget What You Learn</h1>
          <p className="text-lg">
            Lernote makes it easy to capture and review your notes from podcasts
            and books, transforming the way you absorb, retain and recall
            information.
          </p>
          <div className="m-auto mb-4 flex flex-col gap-3 lg:m-0 lg:flex-row">
            <Button onClick={() => void signIn()}>GET STARTED FOR FREE</Button>
            <Link
              className="rounded border border-black px-4 py-2 font-semibold duration-200 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white"
              href="/#demo"
              scroll={false}
            >
              WATCH DEMO
            </Link>
          </div>
        </div>
        <div className="flex p-4 align-middle lg:w-2/3">
          <Image
            priority={true}
            src="/taking_notes.svg"
            width="0"
            height="0"
            sizes="100vw"
            className="h-auto w-full"
            alt="Taking Notes Illustration"
          />
        </div>
      </section>
      <section className="flex gap-16 p-4">
        <ul className="flex flex-col gap-8 lg:flex-row">
          {FEATURES.map((feature, index) => {
            return (
              <li
                key={index}
                className="flex flex-col  rounded-lg border p-4 text-center shadow"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <p className="mb-4 text-lg font-semibold">{feature.headline}</p>
                <p>{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <section id="demo" className="mb-4 flex flex-col items-center gap-4 p-4">
        <h2 className="text-center text-4xl font-bold">Demo</h2>
        <iframe
          className="h-96 w-full shadow-2xl lg:h-[540px] lg:w-[960px]"
          src="https://www.youtube.com/embed/a0BeRnAGPDo?mute=1"
          allowFullScreen
        ></iframe>
      </section>
    </>
  );
}
