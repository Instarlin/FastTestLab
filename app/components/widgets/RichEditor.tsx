import { Editor, EditorContent } from "@tiptap/react";
import { useRef } from "react";
import { CustomBubbleMenu } from "~/components/editor/extensions/bubble-menu/bubble";

export const RichEditor = ({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) => {
  if (!editor) return null;

  const editorBoundsRef = useRef(null);

  return (
    <div className={className} ref={editorBoundsRef}>
      <EditorContent editor={editor} className="flex flex-col h-full w-full" />
      <CustomBubbleMenu editor={editor} />
    </div>
  );
};
