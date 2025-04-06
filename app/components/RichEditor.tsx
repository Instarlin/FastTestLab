import { Editor, EditorContent } from "@tiptap/react";
import { useRef } from "react";
import { CustomBubbleMenu } from "./editor/menus/bubble/bubble";

const RichEditor = ({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) => {
  if (!editor) return null;

  const editorBoundsRef = useRef(null);
  // const [dimensions, setDimensions] = useState("calc(7/12 * 100%)");

  // useEffect(() => {
  //   if (editorBoundsRef.current) {
  //     const { width } = (editorBoundsRef.current as HTMLElement).getBoundingClientRect();
  //     setDimensions(`${width}px`);
  //   }
  // }, []);

  return (
    <div style={{}} className={className} ref={editorBoundsRef}>
      <EditorContent editor={editor} className="flex flex-col h-full w-full" />
      {/* <TableOptionsMenu editor={editor} /> */}
      <CustomBubbleMenu editor={editor} />
    </div>
  );
};

export default RichEditor;
