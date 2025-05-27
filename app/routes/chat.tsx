import type { Route } from "./+types/home";
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import { Trash2Icon, SendHorizontalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserID } from "~/modules/session.server";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const userID = await getUserID(request);
  if (!userID) return redirect("/auth?formType=login");
  return null;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await axios.get("/api/chats");
        setChats(response.data);
        if (response.data.length > 0) {
          setSelectedChat(response.data[0].id);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    loadChats();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      setIsLoadingChat(true);
      try {
        const response = await axios.get(`/api/chats/${selectedChat}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoadingChat(false);
      }
    };
    loadMessages();
  }, [selectedChat]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setFiles((prev) => [...prev, file]);
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

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      await axios.post(`/api/chats/${selectedChat}/messages`, {
        message: userMessage.content,
        files: files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      });

      //* Assistant response (mock for now)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a mock response. Server integration needed.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
              className={`hover:cursor-pointer rounded-lg p-2 ${
                selectedChat === chat.id
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
                    {isLoadingChat ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
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
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
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

      {/* Context Section */}
      <div className="hidden md:block min-w-[350px] border-l-1 border-gray-200 bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Context</h2>
        <div className="space-y-2">
          {/* Context items will go here */}
          <div className="hover:cursor-pointer rounded-lg bg-muted p-2">
            File 1
          </div>
          <div className="hover:cursor-pointer rounded-lg p-2 hover:bg-muted">
            File 2
          </div>
        </div>
      </div>
    </div>
  );
}
