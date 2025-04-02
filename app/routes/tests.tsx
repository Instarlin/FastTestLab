import type { Route } from "./+types/home"
import { BreadcrumbLink } from "~/components/Sidebar";
import { Link, Outlet } from "react-router"
import { useEditorState } from "@tiptap/react"
import RichEditor from "~/components/RichEditor"
import useRichEditor from "~/components/editor/hooks/useRichEditor"
import '~/styles/editor.css'
import { useMessage } from "~/components/Message";


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
  const { showMessage } = useMessage();

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
      className="flex relative flex-row justify-around lg:justify-between items-start overflow-y-scroll overflow-x-hidden pl-6">
      <div className="hidden lg:block sticky top-5 text-sm w-28">
        <p>{characters} characters</p>
        <p>{words} words</p>
      </div>
      <RichEditor editor={editor!} 
      className="w-full px-4 sm:w-11/12 md:max-w-[640px] lg:max-w-[640px] xl:max-w-[960px] xxl:max-w-[1280px]"/>
      <div className="hidden lg:flex flex-col gap-1.5 sticky top-5 right-8">
        <Link onClick={() => showMessage('error', 'Chimin Extra')} to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
      </div>
      <Outlet />
    </div>
  );
}
