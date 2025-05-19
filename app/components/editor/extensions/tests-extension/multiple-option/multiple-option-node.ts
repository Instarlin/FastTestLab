import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MultipleOption } from './MultipleOption'

interface MultipleOptionAttributes {
  options: Array<{
    value: string
    label: string
  }>
  defaultValues?: string[]
  selectedValues?: string[]
  correctAnswers?: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    multipleoption: {
      toggleMultipleOption: (attributes?: MultipleOptionAttributes) => ReturnType,
    }
  }
}

export default Node.create({
  name: 'multipleOptionNode',
  group: 'block list',
  atom: false,
  selectable: false,

  addAttributes() {
    return {
      options: {},
      selectedValues: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'multiple-option',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['multiple-option', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      toggleMultipleOption: (attributes?: MultipleOptionAttributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(MultipleOption)
  },
}) 