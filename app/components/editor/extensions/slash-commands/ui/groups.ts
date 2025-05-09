import { Editor } from '@tiptap/core'
import { icons } from 'lucide-react'
import { SingleOptionForm } from '../../tests-extension/single-option-form'
import { MultipleOptionForm } from '../../tests-extension/multiple-option-form'
export interface Command {
  name: string
  label: string
  description: string
  aliases?: string[]
  iconName: keyof typeof icons
  action?: (editor: Editor, data?: any) => void
  shouldBeHidden?: (editor: Editor) => boolean
  dialog?: {
    title: string
    description: string
    component: React.ComponentType<{
      onSubmit: (data: any) => void
      editor: Editor
    }>
  }
}

export interface Group {
  name: string
  title: string
  commands: Command[]
}

export const GROUPS: Group[] = [
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading1',
        label: 'Heading 1',
        iconName: 'Heading1',
        description: 'High priority section title',
        aliases: ['h1'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 1 }).run()
        },
      },
      {
        name: 'heading2',
        label: 'Heading 2',
        iconName: 'Heading2',
        description: 'Medium priority section title',
        aliases: ['h2'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 2 }).run()
        },
      },
      {
        name: 'heading3',
        label: 'Heading 3',
        iconName: 'Heading3',
        description: 'Low priority section title',
        aliases: ['h3'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 3 }).run()
        },
      },
      {
        name: 'bulletList',
        label: 'Bullet List',
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: editor => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List',
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: editor => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        name: 'blockquote',
        label: 'Blockquote',
        iconName: 'Quote',
        description: 'Element for quoting',
        action: editor => {
          editor.chain().focus().setBlockquote().run()
        },
      },
      {
        name: 'codeBlock',
        label: 'Code Block',
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().setCodeBlock().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'Insert',
    commands: [
      {
        name: 'table',
        label: 'Table',
        iconName: 'Table',
        description: 'Insert a table',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
        },
      },
      {
        name: 'horizontalRule',
        label: 'Horizontal Rule',
        iconName: 'Minus',
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        action: editor => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
    ],
  },
  {
    name: 'test',
    title: 'Test',
    commands: [
      {
        name: 'singleOption',
        label: 'Single Option Test',
        iconName: 'SquareCheck',
        description: 'Creates test with single option',
        action: (editor, data) => {
          editor.chain().focus()
          .undo()
          .toggleSigleOption({
            options: data.options,
            defaultValue: data.options[0]?.value
          }).run();
        },
        dialog: {
          title: 'Create Single Choice Question',
          description: 'Add options for your single choice question and select the correct answer.',
          component: SingleOptionForm
        }
      },
      {
        name: 'multyOption',
        label: 'Multy Option Test',
        iconName: 'CopyCheck',
        description: 'Creates test with multy options',
        action: (editor, data) => {
          editor.chain().focus()
          .undo()
          .toggleMultipleOption({
            options: data.options,
          }).run();
        },
        dialog: {
          title: 'Create Multiple Choice Question',
          description: 'Add options for your multiple choice question and select all correct answers.',
          component: MultipleOptionForm
        }
      }
    ]
  }
]

export default GROUPS