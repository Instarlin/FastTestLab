import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon, CircleCheckIcon, CircleAlertIcon, CircleXIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

type MessageType = 'success' | 'error' | 'info' | 'warning';

interface Message {
  id: number;
  content: string;
  type: MessageType;
}

interface MessageContextType {
  showMessage: (type: MessageType, content: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType | null>(null);
let idCounter = 0;

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showMessage = useCallback(
    (type: MessageType, content: string, duration = 3000) => {
      const id = ++idCounter;
      setMessages((prev) => [...prev, { id, content, type }]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }, duration);
    },
    []
  );

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    layout: { duration: 0.2, ease: 'easeInOut' },
                    duration: 0.15
                  }}
                  className={cn(
                    'px-4 py-2 rounded text-white shadow-md min-w-[200px]',
                    msg.type === 'success' && 'bg-green-500',
                    msg.type === 'error' && 'bg-red-500',
                    msg.type === 'info' && 'bg-blue-500',
                    msg.type === 'warning' && 'bg-yellow-500 text-black'
                  )}
                >
                  {msg.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
