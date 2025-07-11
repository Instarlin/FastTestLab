import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { BubbleMenuBtn } from "./bubble-menu-btn";

interface SelectorResult {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isCode: boolean;
  isMath: boolean;
}

const items = [
  {
    icon: BoldIcon,
    onClick: (editor: Editor) => {
      editor.chain().focus().toggleBold().run();
    },
    isActive: (state: SelectorResult) => state.isBold,
  },
  {
    icon: ItalicIcon,
    onClick: (editor: Editor) => {
      editor.chain().focus().toggleItalic().run();
    },
    isActive: (state: SelectorResult) => state.isItalic,
  },
  {
    icon: UnderlineIcon,
    onClick: (editor: Editor) => {
      editor.chain().focus().toggleUnderline().run();
    },
    isActive: (state: SelectorResult) => state.isUnderline,
  },
  {
    icon: StrikethroughIcon,
    onClick: (editor: Editor) => {
      editor.chain().focus().toggleStrike().run();
    },
    isActive: (state: SelectorResult) => state.isStrike,
  },
  {
    icon: CodeIcon,
    onClick: (editor: Editor) => {
      editor.chain().focus().toggleCode().run();
    },
    isActive: (state: SelectorResult) => state.isCode,
  },
];

export const TextButtons = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState<SelectorResult>({
    editor,
    selector: (instance) => ({
      isBold: instance.editor.isActive("bold"),
      isItalic: instance.editor.isActive("italic"),
      isUnderline: instance.editor.isActive("underline"),
      isStrike: instance.editor.isActive("strike"),
      isCode: instance.editor.isActive("code"),
      isMath: instance.editor.isActive("math"),
    }),
  });

  return (
    <BubbleMenuBtn items={items} editor={editor} editorState={editorState} />
  );
};
