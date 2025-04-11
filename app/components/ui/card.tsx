import { MoveRightIcon, BookOpenCheckIcon, NotebookPenIcon, PencilLineIcon, BookIcon, LibraryBigIcon, CheckIcon } from "lucide-react";
import { CardSpotlight } from "../CardSpotLight";
import { DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "../Dialog";
import { Dialog } from "../Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Link } from "react-router";

const lessons = [
  {
    title: "Lesson 1",
    description: "Lesson 1 Description",
    subLessons: [
      {
        title: "Sub Lesson 1",
        description: "Sub Lesson 1 Description",
        icon: "practice",
      },
      {
        title: "Sub Lesson 2",
        description: "Sub Lesson 2 Description",
        icon: "theory",
      },
    ],
  },
  {
    title: "Lesson 2",
    description: "Lesson 2 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
    ],
  },
  {
    title: "Lesson 3",
    description: "Lesson 3 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
      },
    ],
  },
];
function Card({ 
  size,
  title,
  picture,
  description,
}: {
  size: string
  title: string,
  picture: string,
  description: string,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          style={{
            flexBasis: `calc(${size} - 0.5rem)`,
            maxWidth: `calc(${size} - 0.5rem)`,
          }}
          className="group rounded-md border border-gray-300 overflow-hidden p-0 min-h-[200px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
        >
          <div
            className="w-full flex-3 bg-cover bg-center"
            style={{
              backgroundImage:
                `url(${picture})`,
            }}
          ></div>
          <div className="w-full flex-1 bg-background group-hover:bg-accent z-20 flex flex-row justify-start items-center px-4 transition-colors duration-500">
            <p>{title}</p>
            <MoveRightIcon className="ml-auto mr-2 opacity-55 size-7 group-hover:translate-x-1 transition-transform duration-500" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[800px] md:max-h-[600px] overflow-y-auto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Accordion type="multiple" className="w-full max-h-[400px] overflow-y-auto overflow-x-clip">
          {lessons.map((lesson) => (
            <AccordionItem value={lesson.title} className="">
              <AccordionTrigger>
                <DialogHeader>
                  <DialogTitle>{lesson.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <p>{lesson.description}</p>
                </DialogDescription>
              </AccordionTrigger>
              <AccordionContent>
                {lesson.subLessons?.map((subLesson) => (
                  <Link to={'/tests'} className="contents">
                    <div key={subLesson.title} className="flex flex-row justify-start gap-5 items-center px-2 py-2 rounded-md mr-2 hover:bg-accent transition-colors duration-300 first:mt-2">
                      {subLesson.icon === "theory"
                        ? <PencilLineIcon className="size-4 text-zinc-600" />
                        : <LibraryBigIcon className="size-4 text-zinc-600" />
                      }
                      <p>{subLesson.title}</p>
                      <CheckIcon className="size-4 text-zinc-600 ml-auto" />
                    </div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};

export { Card };