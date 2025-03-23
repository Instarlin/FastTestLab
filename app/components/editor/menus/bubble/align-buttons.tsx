import { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, CheckIcon, ChevronDownIcon } from "lucide-react"
import { BubbleMenuBtn } from "~/components/editor/ui/bubble-menu-btn"

interface SelectorResult {
  isLeft: boolean;
  isCenter: boolean;
  isRight: boolean;
}

const items = [
  {
    title: "Left",
    icon: AlignLeftIcon,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("left").run(),
    isActive: (state: SelectorResult) => state.isLeft,
  },
  {
    title: "Center",
    icon: AlignCenterIcon,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("center").run(),
    isActive: (state: SelectorResult) => state.isCenter,
  },
  {
    title: "Right",
    icon: AlignRightIcon,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("right").run(),
    isActive: (state: SelectorResult) => state.isRight,
  },
];

export const AlignButtons = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState<SelectorResult>({
    editor,
    selector: (instance) => ({
      isLeft: instance.editor.isActive({ textAlign: "left" }),
      isCenter: instance.editor.isActive({ textAlign: "center" }),
      isRight: instance.editor.isActive({ textAlign: "right" }),
    }),
  });

  return <BubbleMenuBtn items={items} editor={editor} editorState={editorState} />
};