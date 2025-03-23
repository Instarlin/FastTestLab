import type { Route } from "./+types/home"
import { BreadcrumbLink } from "~/components/Breadcrumb"
import { Link, Outlet } from "react-router"
import { useEditorState } from "@tiptap/react"
import RichEditor from "~/components/RichEditor"
import useRichEditor from "~/components/editor/hooks/useRichEditor"


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to='/tests'>Tests</BreadcrumbLink>
}

export default function Tests() {

  const { editor } = useRichEditor();

  const { characters, words } = useEditorState({
    editor,
    selector(ctx): { characters: number, words: number } {
      const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
      return { characters: characters(), words: words() }
    }
  }) ?? { characters: 0, words: 0 };

  return (
    <div 
      className="flex relative flex-row justify-between items-start overflow-y-scroll overflow-x-hidden pl-6">
      <div className="sticky top-5 text-sm w-28">
        <p>{characters} characters</p>
        <p>{words} words</p>
      </div>
      <RichEditor editor={editor!} />
      <div className="sticky top-5 right-8 flex flex-col gap-1.5">
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
      </div>
      <Outlet />
    </div>
  );
}
