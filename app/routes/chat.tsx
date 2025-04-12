import { BreadcrumbLink } from "~/components/Sidebar";
import type { Route } from "./+types/home";
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
import { CloudUploadIcon, Trash2Icon, SendIcon, SendHorizontalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Chat" },
    { name: "description", content: "Chat interface with file uploads" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/chat">Chat</BreadcrumbLink>,
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setFiles(prev => [...prev, file]);
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
      maxFiles: 10,
    },
  });

  return (
    <div className="flex h-full">
      {/* Chat List Section */}
      <div className="w-64 border-r-1 border-gray-200 bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>
        <div className="space-y-2">
          {/* Chat list items will go here */}
          <div className="rounded-lg bg-muted p-2">Chat 1</div>
          <div className="rounded-lg p-2 hover:bg-muted">Chat 2</div>
        </div>
      </div>

      {/* Main Chat Section */}

      <div className="flex flex-1 flex-col">
        <Dropzone {...dropzone}>
          <DropZoneArea className="container p-0 m-0 h-full rounded-none border-none bg-background ring-offset-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
            <DropzoneTrigger className="flex flex-1 flex-col h-full p-0 m-0 cursor-auto bg-background hover:bg-background ring-offset-none transition-colors focus-within:outline-none has-[input:focus-visible]:ring-0 has-[input:focus-visible]:ring-offset-0">
              <div className="flex-1 overflow-y-auto p-4">
                {/* Chat messages will go here */}
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg bg-primary p-3 text-primary-foreground">
                      Hello, how can I help you today?
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Section */}
              <div className="flex flex-col justify-between border-t-1 border-gray-200 p-4">
                {files.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="relative flex flex-1 flex-row gap-4 justify-between items-center">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          // Handle send message here
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full resize-none rounded-lg border-1 border-gray-200 bg-background px-4 py-2 min-h-[40px] max-h-[120px] overflow-y-scroll focus-visible:outline-none"
                      rows={1}
                      style={{
                        height: 'auto',
                        minHeight: '40px',
                        maxHeight: '120px', 
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                      }}
                    />
                  </div>
                  <Button variant='ghost' className="absolute right-2 bottom-2">
                    <SendHorizontalIcon className="size-4" />
                  </Button>
                </div>
              </div>
              {/* </div> */}
            </DropzoneTrigger>
          </DropZoneArea>
        </Dropzone>
      </div>


      {/* Context Section */}
      <div className="w-64 border-l-1 border-gray-200 bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Context</h2>
        <div className="space-y-2">
          {/* Context items will go here */}
          <div className="rounded-lg bg-muted p-2">File 1</div>
          <div className="rounded-lg p-2 hover:bg-muted">File 2</div>
        </div>
      </div>
    </div>
  );
}