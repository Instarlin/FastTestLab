import { useEditorState, type Editor } from "@tiptap/react";

export const WordCount = ({ editor }: { editor: Editor }) => {
  const { characters, words } = useEditorState({
    editor,
    selector(ctx): { characters: number; words: number } {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  }) ?? { characters: 0, words: 0 };
  return (
    <div className="hidden lg:block sticky top-5 text-sm w-28">
      <p>{characters} characters</p>
      <p>{words} words</p>
    </div>
  )
}