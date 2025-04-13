import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SingleOption } from './single-option'

interface SingleOptionAttributes {
  options: Array<{
    value: string
    label: string
  }>
  defaultValue?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sigleoption: {
      toggleSigleOption: (attributes?: SingleOptionAttributes) => ReturnType,
    }
  }
}

export default Node.create({
  name: 'singleOptionNode',

  group: 'block list',

  atom: true,

  addAttributes() {
    return {
      options: {
        default: [
          { value: 'default', label: 'Default' },
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'compact', label: 'Compact' }
        ],
      },
      defaultValue: {
        default: 'comfortable',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      toggleSigleOption: (attributes?: SingleOptionAttributes) => ({ commands }) => {
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