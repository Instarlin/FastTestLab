import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";

export interface CardI {
  title: string;
  description: string;
  color: string;
  tags: string[];
  picture: string;
}

interface CardDialogProps {
  trigger?: React.ReactNode;
  initialData?: Partial<CardI>;
  onSave: (card: CardI) => void;
  onOpenChange?: (open: boolean) => void;
}

export function CardDialog({ 
  trigger, 
  initialData, 
  onSave,
  onOpenChange 
}: CardDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState(initialData?.color || "#ffffff");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");

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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      color,
      tags,
      picture: dropzone.fileStatuses.length > 0
        ? dropzone.fileStatuses
            .map((file) => file.result)
            .filter((result): result is string => result !== undefined)[0]
        : initialData?.picture || '',
    });
  };

  const resetDropzone = async () => {
    await Promise.all(dropzone.fileStatuses.map(file => dropzone.onRemoveFile(file.id)));
  };

  const resetForm = async () => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setColor(initialData?.color || "#ffffff");
    setTags(initialData?.tags || []);
    setNewTag("");
    await resetDropzone();
  };

  useEffect(() => {
    resetForm();
  }, [initialData]);

  return (
    <Dialog onOpenChange={async (open) => {
      if (!open) {
        await resetForm();
      }
      onOpenChange?.(open);
    }}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Create New Card</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-full sm:max-h-full md:max-w-[640px] md:max-h-[720px] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Card" : "Create New Card"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Edit the card details below." : "Use this form to create a new card."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card Title" className="col-span-3 w-[200px]" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Card Description" className="col-span-3 w-[200px]" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">Color</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 rounded border p-1"
              />
              <Label className="text-sm text-muted-foreground">Choose card color</Label>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="w-[200px]"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground hover:cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Dropzone {...dropzone}>
            <div>
              <div className="flex justify-between">
                <DropzoneDescription>
                  Please add background image for your card
                </DropzoneDescription>
                <DropzoneMessage />
              </div>
              <DropZoneArea className="p-0">
                <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent py-8 m-0 text-center text-sm w-full">
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
          <DialogClose asChild>
            <Button onClick={handleSave}>
              {initialData ? "Save Changes" : "Create Card"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}