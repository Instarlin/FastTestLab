import { useEffect, useRef, useState } from 'react'
import { Editor, EditorContent } from '@tiptap/react'
import { CustomBubbleMenu } from './editor/menus/bubble/bubble'

const RichEditor = ({ editor } : { editor: Editor }) => {
  if (!editor) return null

  const editorBoundsRef = useRef(null);
  const [dimensions, setDimensions] = useState("calc(7/12 * 100%)");

  useEffect(() => {
    if (editorBoundsRef.current) {
      const { width } = (editorBoundsRef.current as HTMLElement).getBoundingClientRect();
      setDimensions(`${width}px`);
    }
  }, []);

  return (
    <div style={{ width: dimensions }} className='h-screen' ref={editorBoundsRef}>
      <EditorContent
        editor={editor}
        className="flex flex-col h-full w-full"
      />
      {/* <TableOptionsMenu editor={editor} /> */}
      <CustomBubbleMenu editor={editor} />
    </div>
  )
}

export default RichEditor
