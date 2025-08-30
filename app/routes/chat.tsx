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
  ChevronsDownIcon,
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
  files?: string[];
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
  const sortChats = (list: Chat[]) =>
    [...list].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.pinned ? -1 : 1;
    });

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageHistory, setMessageHistory] = useState<Record<string, Message[]>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileDb, setFileDb] = useState<Record<string, string[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/chat/loadChats");
      if (res.ok) {
        const data = await res.json();
        const parsed = data.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        }));
        setChats(sortChats(parsed));
        if (parsed[0]) {
          setSelectedChat(parsed[0].id);
          const msgRes = await fetch(`/api/chat/loadChat/${parsed[0].id}`);
          if (msgRes.ok) {
            const msgs = await msgRes.json();
            const parsedMsgs = msgs.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }));
            setMessageHistory({ [parsed[0].id]: parsedMsgs });
            setMessages(parsedMsgs);
            setFileDb((prev) => ({ ...prev, [parsed[0].id]: parsedMsgs.flatMap((m: any) => m.files || []) }));
          }
        }
      }
    };
    load();
  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 400;
      setShowScrollButton(!isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

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
        // "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 10,
    },
    noClick: true,
  });

  const createChat = async () => {
    const res = await fetch("/api/chat/createChat", { method: "POST" });
    if (res.ok) {
      const chat: Chat = await res.json();
      chat.timestamp = new Date(chat.timestamp);
      setChats((prev) => sortChats([chat, ...prev]));
      setMessageHistory((prev) => ({ ...prev, [chat.id]: [] }));
      setSelectedChat(chat.id);
      setMessages([]);
    }
  };

  const deleteChat = async (id: string) => {
    await fetch(`/api/chat/updateChat/${id}`, { method: "DELETE" });
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

  const togglePinChat = async (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    const res = await fetch(`/api/chat/updateChat/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !chat.pinned }),
    });
    if (res.ok) {
      const updated: Chat = await res.json();
      updated.timestamp = new Date(updated.timestamp);
      setChats((prev) => sortChats(prev.map((c) => (c.id === id ? updated : c))));
    }
  };

  const renameChat = async (id: string) => {
    const current = chats.find((c) => c.id === id);
    if (!current) return;
    const name = window.prompt("Rename chat", current.title);
    if (name) {
      const res = await fetch(`/api/chat/updateChat/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name }),
      });
      if (res.ok) {
        const updated: Chat = await res.json();
        updated.timestamp = new Date(updated.timestamp);
        setChats((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    setIsLoading(true);

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          const uploadRes = await fetch("/api/chat/uploadFile", { method: "POST", body: data });
          if (uploadRes.ok) {
            const { key } = await uploadRes.json();
            return key as string;
          }
          return "";
        })
      );

      const res = await fetch(`/api/chat/createMessage/${selectedChat}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message, files: uploaded.filter(Boolean) }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = data.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessageHistory((prev) => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), ...parsed],
        }));
        setMessages((prev) => [...prev, ...parsed]);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat
              ? { ...chat, lastMessage: parsed[0].content, timestamp: parsed[0].timestamp }
              : chat,
          ),
        );
        setFileDb((prev) => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), ...uploaded.filter(Boolean)],
        }));
        setFiles([]);
        setMessage("");
        setIsMultiline(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (id: string) => {
    setSelectedChat(id);
    const res = await fetch(`/api/chat/loadChat/${id}`);
    if (res.ok) {
      const msgs = await res.json();
      const parsed = msgs.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessageHistory((prev) => ({ ...prev, [id]: parsed }));
      setMessages(parsed);
      setFileDb((prev) => ({ ...prev, [id]: parsed.flatMap((m: any) => m.files || []) }));
    }
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
    //TODO: add ability to remove file from DB
    // fetch(`/api/chat/loadChat/${selectedChat}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ files: newFiles }),
    // });
  };

  const dbFilesList = selectedChat ? fileDb[selectedChat] || [] : [];

  return (
    <div className="flex h-full">
      {/* Chat List Section */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-card shadow-sm overflow-y-auto">
        <div className="sticky top-0 mb-4 flex items-center justify-between py-2 px-4 bg-background/75 backdrop-blur-sm border-b border-gray-200">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button size="icon" variant="ghost" onClick={createChat}>
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <div className="space-y-2 p-4">
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
      <div className="flex relative flex-1 flex-col bg-background">
        <Dropzone {...dropzone}>
          <div className="flex-1 overflow-y-auto">
            <DropZoneArea className="h-full p-0 m-0 rounded-none border-none bg-background ring-offset-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              <div ref={messagesContainerRef} className="h-full w-full overflow-y-auto pb-20">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.role === "user"
                            ? "bg-muted shadow-black/15"
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
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="truncate max-w-40"
                                >
                                  {(() => {
                                    const fileNameWithParams = decodeURIComponent(file.split("/").pop() || "Error");
                                    const name = fileNameWithParams.split("?")[0];
                                    return name.length > 37 ? name.slice(37) : name;
                                  })()}
                                </a>
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
          <div className="absolute bottom-0 gap-2 bg-background/0 p-4 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToBottom}
              className={`
                rounded-full left-[calc(50%-16px)] absolute -top-8 border border-gray-300 bg-background
                transition-all duration-300
                ${showScrollButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
              `}
            >
              <ChevronsDownIcon className="size-4" />
            </Button>
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
              <DropzoneTrigger className="flex h-8 w-8 p-0 bg-background items-center justify-center rounded-full hover:bg-accent">
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
                //TODO: fix broken animation on multiline
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  const newHeight = Math.min(target.scrollHeight, 120);
                  target.style.height = `${newHeight}px`;
                  setIsMultiline(target.scrollHeight > 40);
                }}
              />
              <Button size="icon" variant="ghost" className="rounded-full" onClick={sendMessage} disabled={isLoading}>
                <SendHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>
        </Dropzone>
      </div>

      {/* File Database Section */}
      <div className="hidden md:block w-80 flex-shrink-0 border-l border-gray-200 bg-card shadow-sm overflow-y-auto">
        <h2 className="sticky top-0 bg-background/75 backdrop-blur-sm py-2 pl-4 border-b border-gray-200 text-lg font-semibold">Files</h2>
        <div className="space-y-2 p-2">
          {dbFilesList.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md p-2 hover:bg-muted hover:cursor-pointer"
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).closest("button")
                ) return;
                window.open(file, "_blank");
              }}
            >
              <p
                rel="noopener noreferrer"
                className="truncate"
              >
                {(() => {
                  const fileNameWithParams = decodeURIComponent(file.split("/").pop() || "Error");
                  const name = fileNameWithParams.split("?")[0];
                  return name.length > 37 ? name.slice(37) : name;
                })()}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:cursor-pointer hover:bg-muted"
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
