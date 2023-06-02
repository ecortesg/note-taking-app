import { Button } from "./Button";
import { signIn } from "next-auth/react";
import { VscLightbulb, VscIssueReopened, VscLibrary } from "react-icons/vsc";
import Image from "next/image";

const FEATURES = [
  {
    header: "Unleash the Potential of Your Thoughts",
    text: "Lernote provides a dedicated space to crystallize your thoughts, organize findings, and deepen your understanding. Whether you're an avid reader, a podcast enthusiast, or a lifelong learner, our intuitive platform empowers you to expand your intellectual prowess.",
    icon: <VscLightbulb className="h-8 w-8 text-blue-500" />,
  },
  {
    header: "Master with Spaced Repetition",
    text: "Leverage the proven technique of spaced repetition to enhance your memory retention. By selecting random notes from your database, Lernote allows you to revisit concepts and reinforce your learning over time.",
    icon: <VscIssueReopened className="h-8 w-8 text-blue-500" />,
  },
  {
    header: "Effortless Note Management",
    text: "With Lernote, you have full control over your knowledge library. Create, edit, filter and delete effortlessly. Our sleek and intuitive interface ensures a seamless note-taking experience, allowing you to focus on what truly matters—expanding your intellectual horizons.",
    icon: <VscLibrary className="h-8 w-8 text-blue-500" />,
  },
];

export function HomePage() {
  return (
    <>
      <section className="mb-4 flex w-full flex-col items-center justify-between lg:flex-row">
        <div className="flex flex-col gap-6 p-4 text-center lg:w-1/2 lg:text-left">
          <h1 className="text-4xl font-bold">
            &quot;Your brain is for having ideas, not for holding them.&quot;
          </h1>
          <p className="text-lg font-bold">- David Allen</p>
          <p className="text-lg">
            Lernote makes it easy to capture your thoughts and learnings,
            transforming the way you absorb, retain and recall information.
          </p>
          <div>
            <Button className="mb-4" onClick={() => void signIn()}>
              GET STARTED FOR FREE
            </Button>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <Image
            src="/taking_notes.svg"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto"
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
                <p className="mb-4 text-lg font-semibold">{feature.header}</p>
                <p>{feature.text}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
