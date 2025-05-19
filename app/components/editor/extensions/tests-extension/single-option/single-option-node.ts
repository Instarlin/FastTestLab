import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SingleOption } from './SingleOption'

interface SingleOptionAttributes {
  options: Array<{
    value: string
    label: string
  }>
  defaultValue?: string
  selectedValue?: string
  correctAnswer?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    singleoption: {
      toggleSingleOption: (attributes?: SingleOptionAttributes) => ReturnType,
    }
  }
}

export default Node.create({
  name: 'singleOptionNode',
  group: 'block list header',
  inline: false,
  atom: false,
  selectable: false,
  allowGapCursor: true,

  addAttributes() {
    return {
      options: {},
      selectedValue: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'single-option',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['single-option', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      toggleSingleOption: (attributes?: SingleOptionAttributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(SingleOption)
  },
})