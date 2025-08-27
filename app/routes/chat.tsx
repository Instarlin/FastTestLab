import type { Route } from "./+types/chat";
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import { Trash2Icon, SendHorizontalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat" },
    { name: "description", content: "Chat interface with file uploads" },
  ];
}

export default function Chat() {
  const initialChats: Chat[] = [
    {
      id: "1",
      title: "General",
      lastMessage: "Start chatting!",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Project",
      lastMessage: "Discuss the project here",
      timestamp: new Date(),
    },
  ];

  const initialMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        content: "Welcome to General chat",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
    "2": [
      {
        id: "m2",
        content: "Welcome to Project chat",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
  };

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<string | null>(
    initialChats[0]?.id ?? null,
  );
  const [messageHistory, setMessageHistory] = useState<Record<string, Message[]>>(
    initialMessages,
  );
  const [messages, setMessages] = useState<Message[]>(
    initialMessages[initialChats[0].id],
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [fileDb, setFileDb] = useState<Record<string, File[]>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(messageHistory[selectedChat] || []);
    }
  }, [selectedChat, messageHistory]);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setFiles((prev) => [...prev, file]);
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

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "This is a mock response. Server integration needed.",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessageHistory((prev) => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        userMessage,
        assistantMessage,
      ],
    }));

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat
          ? { ...chat, lastMessage: userMessage.content, timestamp: new Date() }
          : chat,
      ),
    );

    setFileDb((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), ...files],
    }));

    setFiles([]);
    setMessage("");
  };

  const handleChatSelect = (id: string) => {
    setSelectedChat(id);
  };

  const removeAttachment = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDbFile = (index: number) => {
    if (!selectedChat) return;
    setFileDb((prev) => {
      const newFiles = [...(prev[selectedChat] || [])];
      newFiles.splice(index, 1);
      return { ...prev, [selectedChat]: newFiles };
    });
  };

  const dbFilesList = selectedChat ? fileDb[selectedChat] || [] : [];

  return (
    <div className="flex h-full">
      {/* Chat List Section */}
      <div className="hidden md:block min-w-[200px] border-r-1 border-gray-200 bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`hover:cursor-pointer rounded-lg p-2 ${selectedChat === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }`}
            >
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex flex-1 flex-col h-[calc(100vh-0.5rem)]">
        <div className="flex-1 min-h-0">
          <Dropzone {...dropzone}>
            <DropZoneArea className="h-full p-0 m-0 rounded-none border-none bg-background ring-offset-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              <DropzoneTrigger className="h-full w-full p-0 m-0 cursor-auto bg-background hover:bg-background ring-offset-none transition-colors focus-within:outline-none has-[input:focus-visible]:ring-0 has-[input:focus-visible]:ring-offset-0">
                <div className="h-full w-full overflow-y-auto">
                  <div className="p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                            }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </DropzoneTrigger>
            </DropZoneArea>
          </Dropzone>
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
                    onClick={() => removeAttachment(index)}
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
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="w-full resize-none rounded-lg border-1 border-gray-200 bg-background px-4 py-2 min-h-[40px] max-h-[120px] overflow-y-scroll focus-visible:outline-none"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "40px",
                  maxHeight: "120px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>
            <Button
              variant="ghost"
              className="absolute right-2 bottom-[9px]"
              onClick={sendMessage}
            >
              <SendHorizontalIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Database Section */}
      <div className="hidden md:block min-w-[350px] border-l-1 border-gray-200 bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Files</h2>
        <div className="space-y-2">
          {dbFilesList.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg p-2 hover:bg-muted"
            >
              <span className="truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => removeDbFile(index)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
          {dbFilesList.length === 0 && (
            <div className="text-sm text-muted-foreground">No files uploaded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
