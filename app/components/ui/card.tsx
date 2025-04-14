import { MoveRightIcon, PencilLineIcon, LibraryBigIcon, CheckIcon } from "lucide-react";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "./dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Link } from "react-router";
import type React from "react";

interface Lesson {
  title: string;
  description: string;
  subLessons: {
    title: string;
    icon: string;
    succsess: boolean;
  }[];
}

function Card({ 
  size,
  title,
  picture,
  description,
  lessons,
  settingsButton
}: {
  size: string;
  title: string;
  picture: string;
  description: string;
  lessons: Lesson[];
  settingsButton?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
          <div
            style={{
              flexBasis: `calc(${size} - 0.5rem)`,
              maxWidth: `calc(${size} - 0.5rem)`,
            }}
            className="relative group rounded-md border border-gray-300 overflow-hidden p-0 max-h-1/4 min-h-[200px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
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
              <MoveRightIcon className="size-4 ml-auto" />
            </div>
          </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[800px] md:max-h-[800px] overflow-hidden">
        {settingsButton}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="w-full h-[200px] bg-background bg-cover bg-center rounded-md relative overflow-hidden"
          style={{
            backgroundImage: `url(${picture})`,
          }}
        >
          <div className="absolute inset-0 -bottom-2 bg-gradient-to-t from-white/100 to-transparent pointer-events-none" />
        </div>
        <Accordion type="multiple" className="w-full max-h-[400px] overflow-y-auto overflow-x-none">
          {lessons.map((lesson) => (
            <AccordionItem value={lesson.title}>
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
                      {subLesson.succsess ? <CheckIcon className="size-4 text-zinc-600 ml-auto" /> : null}
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