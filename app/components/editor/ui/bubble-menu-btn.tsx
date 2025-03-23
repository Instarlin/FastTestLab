import type { Editor } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";


export const BubbleMenuBtn = ({ 
  items, editor, editorState 
} : {
  items: {
    icon: LucideIcon,
    onClick: (editor: Editor) => void,
    isActive: (editorState: any) => boolean
  }[],
  editor: Editor,
  editorState: any
}) => {
  return (
    <>
      {items.map((item, i) => {
        return (
          <button
            key={i}
            className="px-2 py-2 rounded-md hover:bg-gray-100 h-full hover:cursor-pointer"
            style={item.isActive(editorState) ? { backgroundColor: "#e5e7eb" } : {}}
            onClick={() => {
              item.onClick(editor);
            }}
          >
            <item.icon
              className={"size-4"}
              strokeWidth={2.5}
            />
          </button>
        );
      })}
    </>
  )
}