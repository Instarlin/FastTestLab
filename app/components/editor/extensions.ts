import { Extension, mergeAttributes, textInputRule } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table, { createColGroup } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { type DOMOutputSpec } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { Markdown } from "tiptap-markdown";
import { TrailingNode } from "./extensions/trailing-node";
import { SlashCommand } from "./extensions/slash-commands/commands";
import SingleOptionNode from "./extensions/tests-extension/single-option/single-option-node";
import MultipleOptionNode from "./extensions/tests-extension/multiple-option/multiple-option-node";
import { cn } from "~/lib/utils";

const TiptapStarterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cn("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cn("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cn("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cn(""),
    },
  },
  codeBlock: false,
  code: {
    HTMLAttributes: {
      class: cn(
        "hover:cursor-pointer hover:bg-zinc-200 transtions-colors duration-300 rounded-lg bg-muted dark:bg-muted/90 dark:text-red-400 px-1.5 py-1 font-mono font-medium before:content-none after:content-none"
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: {
    HTMLAttributes: {
      class: cn("my-4 bg-border border-border"),
    },
  },
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  heading: false,
});

const TiptapHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    if (node.textContent) {
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          id: node.textContent.replaceAll(/\s+/g, "-").toLowerCase(),
          data: 'jump-point'
        }),
        0,
      ];
    }
    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

const TiptapTextAlign = TextAlign.configure({
  types: ["heading", "paragraph", "math"],
});

const TiptapTable = Table.extend({
  renderHTML({ node, HTMLAttributes }) {
    const { colgroup, tableWidth, tableMinWidth } = createColGroup(
      node,
      this.options.cellMinWidth
    );

    const table: DOMOutputSpec = [
      "div",
      {
        class: "table-wrapper overflow-y-auto my-[2em] not-draggable",
      },
      [
        "table",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          style: tableWidth
            ? `width: ${tableWidth}`
            : `minWidth: ${tableMinWidth}`,
        }),
        colgroup,
        ["tbody", 0],
      ],
    ];

    return table;
  },
}).configure({
  HTMLAttributes: {
    class: cn("not-prose table-auto border-collapse w-full"),
  },
  lastColumnResizable: false,
  allowTableNodeSelection: true,
});

const TiptapTableHeader = TableHeader.configure({
  HTMLAttributes: {
    class: cn(
      "bg-muted dark:bg-gray-900 border border-default p-2 text-start min-w-[150px] font-semibold"
    ),
  },
});

const TiptapTableCell = TableCell.configure({
  HTMLAttributes: {
    class: cn("border border-default p-2 min-w-[150px] align-middle"),
  },
});

const TiptapLink = Link.configure({
  HTMLAttributes: {
    class: cn(
      "!text-foreground underline underline-offset-[3px] transition-colors cursor-pointer"
    ),
  },
  openOnClick: false,
});

const TiptapImage = Image.configure({
  allowBase64: false,
  HTMLAttributes: {
    class: cn("rounded border mx-auto"),
  },
});

const DragHandle = GlobalDragHandle.configure({
  dragHandleWidth: 25,
  scrollTreshold: 100,
  excludedTags: [],
  customNodes: ["li"],
});

const markdown = Markdown.configure({
  html: true,
  transformCopiedText: true,
});

const TiptapYoutube = Youtube.configure({
  HTMLAttributes: {
    class: cn("border border-muted"),
  },
  nocookie: true,
});

const TiptapCharacterCount = CharacterCount;

const Smiles = Extension.create({
  name: "smiles",
  addInputRules() {
    return [textInputRule({ find: /O;-\) $/, replace: "😇 " })];
  },
});

const Keymap = Extension.create({
  name: "keymap",
  addKeyboardShortcuts() {
    return {
      "Tab": () => this.editor.chain().command(({ tr }) => {tr.insertText("    "); return true}).run(),
      "Ctrl-1": () => this.editor.commands.toggleHeading({ level: 1 }),
      "Ctrl-2": () => this.editor.commands.toggleHeading({ level: 2 }),
      "Ctrl-3": () => this.editor.commands.toggleHeading({ level: 3 }),
      "Ctrl-4": () => this.editor.commands.toggleCode(),
      "Ctrl-5": () => this.editor.commands.toggleBulletList(),
      "Ctrl-6": () => this.editor.commands.toggleOrderedList(),
      "Ctrl-7": () => this.editor.commands.toggleBlockquote(),
    };
  },
});

export const defaultExtensions = [
  TiptapStarterKit,
  TiptapHeading,
  TiptapTextAlign,
  TiptapTable,
  TiptapTableHeader,
  TableRow,
  TiptapTableCell,
  TiptapLink,
  TiptapYoutube,
  TiptapCharacterCount,
  TiptapImage,
  Underline,
  TextStyle,
  Smiles,
  Keymap,
  TrailingNode,
  SlashCommand,
  DragHandle,
  markdown,
  SingleOptionNode,
  MultipleOptionNode,
  Gapcursor,
];
