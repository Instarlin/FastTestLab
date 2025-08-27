import type { Route } from "./+types/chat";
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import {
  Trash2Icon,
  SendHorizontalIcon,
  UploadIcon,
  PaperclipIcon,
  MoreVerticalIcon,
  PlusIcon,
  PinIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: File[];
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  pinned?: boolean;
}

export function meta({ }: Route.MetaArgs) {
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

  const sortChats = (list: Chat[]) =>
    [...list].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.pinned ? -1 : 1;
    });

  const [chats, setChats] = useState<Chat[]>(sortChats(initialChats));
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChats[0]?.id ?? null);
  const [messageHistory, setMessageHistory] = useState<Record<string, Message[]>>(initialMessages);
  const [messages, setMessages] = useState<Message[]>(initialMessages[initialChats[0].id]);
  const [message, setMessage] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileDb, setFileDb] = useState<Record<string, File[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    noClick: true,
  });

  const createChat = () => {
    const id = Date.now().toString();
    const newChat: Chat = {
      id,
      title: "New Chat",
      lastMessage: "Start chatting!",
      timestamp: new Date(),
      pinned: false,
    };
    setChats((prev) => sortChats([newChat, ...prev]));
    setMessageHistory((prev) => ({ ...prev, [id]: [] }));
    setSelectedChat(id);
    setMessages([]);
  };

  const deleteChat = (id: string) => {
    const nextChats = chats.filter((chat) => chat.id !== id);
    const nextSelected = selectedChat === id ? nextChats[0]?.id ?? null : selectedChat;
    setChats(nextChats);
    setMessageHistory((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setFileDb((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setSelectedChat(nextSelected);
    setMessages(nextSelected ? messageHistory[nextSelected] || [] : []);
  };

  const togglePinChat = (id: string) => {
    setChats((prev) =>
      sortChats(
        prev.map((chat) =>
          chat.id === id ? { ...chat, pinned: !chat.pinned } : chat,
        ),
      ),
    );
  };

  const renameChat = (id: string) => {
    const current = chats.find((c) => c.id === id);
    if (!current) return;
    const name = window.prompt("Rename chat", current.title);
    if (name) {
      setChats((prev) =>
        prev.map((chat) => (chat.id === id ? { ...chat, title: name } : chat)),
      );
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
      files,
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
    setIsMultiline(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button size="icon" variant="ghost" onClick={createChat}>
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`group flex items-center gap-2 rounded-lg p-2 hover:cursor-pointer ${selectedChat === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate flex items-center gap-1">
                  {chat.title}
                  {chat.pinned && <PinIcon className="size-4 ml-1" />}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className={`opacity-0 group-hover:opacity-100 ${selectedChat === chat.id ? "hover:bg-accent/7 hover:text-accent" : "hover:bg-primary/7"}`}
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-50 p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => togglePinChat(chat.id)}
                  >
                    {chat.pinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => renameChat(chat.id)}
                  >
                    Rename
                  </Button>
                  <div className="h-0.5 bg-border/50 my-1"></div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteChat(chat.id)}
                  >
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex flex-1 flex-col h-[calc(100vh-0.5rem)] bg-background">
        <Dropzone {...dropzone}>
          <div className="flex-1 min-h-0">
            <DropZoneArea className="h-full p-0 m-0 rounded-none border-none bg-background ring-offset-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="h-full w-full overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.role === "user"
                            ? "bg-gray-100 shadow-black/15"
                            : "bg-card"
                          }`}
                      >
                        {msg.content}
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 rounded-md bg-background/20 px-2 py-1 text-xs"
                              >
                                <PaperclipIcon className="size-4" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </DropZoneArea>
          </div>

          {/* Chat Input Section */}
          <div className="flex flex-col gap-2 bg-card p-4">
            {files.length > 0 && (
              <div className="mb-1 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm shadow-sm"
                  >
                    <span className="truncate">{file.name}</span>
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
            <div
              className={`flex w-full items-center gap-2 border border-gray-300 bg-background px-3 py-2 shadow-sm 
                hover:shadow-md transition-all duration-300
                ${isMultiline ? "rounded-xl" : "rounded-full"}`
              }
            >
              <DropzoneTrigger className="flex h-8 w-8 p-0 bg-white items-center justify-center rounded-full hover:bg-accent">
                <UploadIcon className="size-4" />
              </DropzoneTrigger>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-transparent resize-none px-2 py-2 text-sm leading-5 placeholder:text-muted-foreground focus-visible:outline-none"
                rows={1}
                style={{ height: "auto", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  const newHeight = Math.min(target.scrollHeight, 120);
                  target.style.height = `${newHeight}px`;
                  setIsMultiline(target.scrollHeight > 40);
                }}
              />
              <Button size="icon" variant="ghost" className="rounded-full" onClick={sendMessage}>
                <SendHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>
        </Dropzone>
      </div>

      {/* File Database Section */}
      <div className="hidden md:block w-80 flex-shrink-0 border-l border-gray-200 bg-card p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Files</h2>
        <div className="space-y-2">
          {dbFilesList.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
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