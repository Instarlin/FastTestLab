import { create } from "zustand";

interface ChatStore {
  chatId: string;
  setChatId: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: "",
  setChatId: (chatId) => set({ chatId }),
}));

interface CourseStore {
  courseId: string;
  setCourseId: (courseId: string) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courseId: "",
  setCourseId: (courseId) => set({ courseId }),
}));
