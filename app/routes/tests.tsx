import type { Route } from "./+types/home";
import { Link, Outlet } from "react-router";
import { useMessage } from "~/components/Message";
import { RichEditor } from "~/components/RichEditor";
import { BreadcrumbLink } from "~/components/Sidebar";
import { WordCount } from "~/components/editor/ui/word-count";
import useRichEditor from "~/components/editor/hooks/useRichEditor";
import "~/styles/editor.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/tests">Tests</BreadcrumbLink>,
};

export default function Tests() {
  const { showMessage } = useMessage();
  const { editor } = useRichEditor();
  console.log(editor?.state.doc)

  return (
    <div className="flex relative flex-row justify-around lg:justify-between items-start overflow-y-scroll overflow-x-hidden pl-6">
      <WordCount editor={editor!} />
      <RichEditor
        editor={editor!}
        className="w-full px-4 sm:w-11/12 md:max-w-[640px] lg:max-w-[640px] xl:max-w-[960px] xxl:max-w-[1280px]"
      />
      <div className="hidden lg:flex flex-col gap-1.5 sticky top-5 right-8">
        <Link
          onClick={() => showMessage("error", "Chimin Extra")}
          to="./extrachimin"
          className="text-blue-300"
        >
          Chimin Extra
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
