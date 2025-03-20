import { useEditor, FloatingMenu, BubbleMenu, EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import { useEffect, useRef, useState } from 'react'
import { useTextmenuStates } from './hooks/useTextMenuStates'
import './drag.css'

const extensions = [StarterKit]

const content = `
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
`

const RichEditor = ({ className }: { className?: string }) => {
  const editorRef = useRef(null);
  const [dimensions, setDimensions] = useState("calc(7/12 * 100%)");
  const [selecting, setSelecting] = useState(false);

  // console.log(StarterKit, 'highlight', Highlight, 'typography', Typography)

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Highlight.configure({
        multicolor: true
      }),
      Typography,
      GlobalDragHandle.configure({
        dragHandleWidth: 20,
        scrollThreshold: 100,
        dragHandleSelector: "drag-handle"
      }),
    ],
  })

  const states = useTextmenuStates(editor!)

  useEffect(() => {
    if (editorRef.current) {
      const { width } = (editorRef.current as HTMLElement).getBoundingClientRect();
      setDimensions(`${width}px`);
    }

    const controller = new AbortController()
    let selectionTimeout: number

    document.addEventListener(
      'selectionchange',
      e => {
        const selection = window.getSelection()

        if (!selection?.anchorNode || !editor?.view.dom.contains(selection.anchorNode)) {
          return
        }

        setSelecting(true)

        if (selectionTimeout) {
          window.clearTimeout(selectionTimeout)
        }

        selectionTimeout = window.setTimeout(() => {
          setSelecting(false)
        }, 500)
      },
      { signal: controller.signal },
    )

    return () => {
      controller.abort()
    }
  }, [editor]);

  return (
    <div style={{ width: dimensions, padding: '100px' }} className={className} ref={editorRef}>
      <EditorProvider
        extensions={extensions}
        content={content}
      >
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu 
          className={selecting ? 'hidden' : ''}
          tippyOptions={{
            popperOptions: {
              placement: 'top-start',
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    padding: 8,
                  },
                },
                {
                  name: 'flip',
                  options: {
                    fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
                  },
                },
              ],
            },
            offset: [0, 8],
            maxWidth: 'calc(100vw - 16px)',
          }}
          editor={editor}
          pluginKey="textMenu"
          shouldShow={states.shouldShow}
          updateDelay={0}
        >
          <div>ewjnfewiowerfewfreffnemf</div>
        </BubbleMenu>
        {/* <DragHandle editor={editor}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </DragHandle> */}
        <div className='drag-handle'></div>
      </EditorProvider>
    </div>
  )
}

export default RichEditor
