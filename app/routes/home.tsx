import { useEffect, useState } from "react";
import { BreadcrumbLink } from "~/components/Sidebar";
import type { Route } from "./+types/home";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Label } from "~/components/ui/label";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/home">Home</BreadcrumbLink>,
};

const cardLayouts = [
  { label: "6 x 2", columns: 6, rows: 2 },
  { label: "10 x 2", columns: 10, rows: 2 },
];

const lessons = [
  {
    title: "Lesson 1",
    description: "Lesson 1 Description",
    subLessons: [
      {
        title: "Sub Lesson 1",
        description: "Sub Lesson 1 Description",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson 2",
        description: "Sub Lesson 2 Description",
        icon: "theory",
        succsess: false,
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
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
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
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
    ],
  },
  {
    title: "Lesson 4",
    description: "Lesson 2 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
    ],
  },
];

export default function Home() {
  const [cardSize, setCardSize] = useState<string>();
  const [layout, setLayout] = useState(cardLayouts[0]);
  const totalCards = layout.columns * layout.rows;
  const cardsArray = Array.from({ length: totalCards });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setCardSize(localStorage.getItem("cardSize") ?? "25%");
  }, []);

  useEffect(() => {
    if (cardSize !== undefined) localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
  });

  return (
    <div className="flex flex-1 flex-col pl-6 overflow-y-scroll group-hover:pointer-events-none">
      <div className="sticky top-0 flex align-middle gap-4 z-30 py-3">
        <Select value={cardSize} onValueChange={setCardSize}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select card size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="20%">Small Cards</SelectItem>
              <SelectItem value="25%">Medium Cards</SelectItem>
              <SelectItem value="33%">Large Cards</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create New Card</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-full sm:h-full md:max-w-[600px] md:h-fit">
            <DialogHeader>
              <DialogTitle>Card Details</DialogTitle>
              <DialogDescription>
                Use this form to create a new card.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card Title" className="col-span-3 w-[200px]" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Card Description" className="col-span-3 w-[200px]" />
              </div>
              <Dropzone {...dropzone}>
                <div>
                  <div className="flex justify-between">
                    <DropzoneDescription>
                      Please add background image for your card
                    </DropzoneDescription>
                    <DropzoneMessage />
                  </div>
                  <DropZoneArea>
                    <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                      <CloudUploadIcon className="size-8" />
                      <div>
                        <p className="font-semibold">Upload listing images</p>
                        <p className="text-sm text-muted-foreground">
                          Click here or drag and drop to upload
                        </p>
                      </div>
                    </DropzoneTrigger>
                  </DropZoneArea>
                </div>
                <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
                  {dropzone.fileStatuses.map((file) => (
                    <DropzoneFileListItem
                      className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                      key={file.id}
                      file={file}
                    >
                      {file.status === "pending" && (
                        <div className="aspect-video animate-pulse bg-black/20" />
                      )}
                      {file.status === "success" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={file.result}
                          alt={`uploaded-${file.fileName}`}
                          className="aspect-video object-cover"
                        />
                      )}
                      <div className="flex items-center justify-between p-2 pl-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-zinc-800 hover:bg-zinc-700 shrink-0 hover:outline aria-disabled:pointer-events-none aria-disabled:opacity-50"
                          onClick={() => dropzone.onRemoveFile(file.id)}
                        >
                          <Trash2Icon className="size-4 text-white" />
                        </Button>
                      </div>
                    </DropzoneFileListItem>
                  ))}
                </DropzoneFileList>
              </Dropzone>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => {
                console.log(dropzone.fileStatuses);
                cardsArray.push({
                  title: "Card Title",
                  description: "Card Description",
                  images: dropzone.fileStatuses.map((file) => file.result),
                });
                setLayout(cardLayouts[0]);
              }}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {cardLayouts.map((option) => (
          <button
            key={option.label}
            className={`px-4 py-2 rounded border ${layout.label === option.label
                ? "bg-blue-600 text-white"
                : "bg-white text-black border-gray-400"
              }`}
            onClick={() => setLayout(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((_, index) => (
          <Card
            title="Card Title"
            picture="https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"
            description="Card Description"
            size={cardSize!}
            key={index}
            lessons={lessons}
          />
        ))}
      </div>
    </div>
  );
}
