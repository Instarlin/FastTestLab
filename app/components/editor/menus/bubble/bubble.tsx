import { Editor, isTextSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import Split from "~/components/editor/ui/bubble-split";
import { AlignButtons } from "./align-buttons";
import { TextButtons } from "./text-buttons";

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
      <Split />
      <AlignButtons editor={editor} />
    </BubbleMenu>
  );
};
