import { Editor, isTextSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { AlignButtons } from "./ui/align-buttons";
import { TextButtons } from "./ui/text-buttons";

export const CustomBubbleMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        placement: "top",
        hideOnClick: false,
        moveTransition: "transform 0.15s ease-out",
      }}
      shouldShow={({ editor, state }) => {
        const { selection } = state;
        const { empty } = selection;

        if (!editor.isEditable) {
          return false;
        }

        if (empty) {
          return false;
        }

        if (!isTextSelection(selection)) {
          return false;
        }

        if (editor.isActive("codeBlock")) {
          return false;
        }

        return true;
      }}
      className="flex flex-row justify-center items-center gap-0.5 py-0.5 px-1 rounded-md overflow-clip bg-white border-1 border-gray-300"
    >
      <TextButtons editor={editor} />
      <div className="w-0.25 h-6 mx-0.5 bg-gray-200 dark:bg-gray-400" />
      <AlignButtons editor={editor} />
    </BubbleMenu>
  );
};
