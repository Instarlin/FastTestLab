import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MultipleOption } from './multiple-option'

interface MultipleOptionAttributes {
  options: Array<{
    value: string
    label: string
  }>
  defaultValues?: string[]
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

  atom: true,

  addAttributes() {
    return {
      options: {
        default: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
      },
      defaultValues: {
        default: [],
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