import type { Route } from "./+types/home";
import { Link, Outlet } from "react-router";
import { useMessage } from "~/components/Message";
import { RichEditor } from "~/components/RichEditor";
import { BreadcrumbLink } from "~/components/Sidebar";
import { WordCount } from "~/components/editor/ui/word-count";
import useRichEditor from "~/components/editor/hooks/useRichEditor";
import { Button } from "~/components/ui/button";
import { PencilIcon, PencilOffIcon } from "lucide-react";
import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    if (editor) {
      editor.setEditable(newEditingState);
    }
  };

  return (
    <div className="flex relative flex-row justify-around lg:justify-between items-start overflow-y-scroll overflow-x-hidden pl-6">
      <div className="hidden top-4 lg:flex flex-row justify-between items-center gap-4 sticky text-sm">
        <Button
          size="icon"
          onClick={toggleEditing}
          className="size-10"
          title={isEditing ? "View mode" : "Edit mode"}
        >
          {isEditing ? <PencilOffIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
        </Button>
        <WordCount editor={editor!} />
      </div>
      <div>
        <RichEditor
          editor={editor!}
          className="w-full px-4 sm:w-11/12 md:max-w-[640px] lg:max-w-[640px] xl:max-w-[960px] xxl:max-w-[1280px]"
        />
        <div className="flex flex-row gap-8">
          <Button>
            Previous
          </Button>
          <Button>
            Next
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col gap-1.5 sticky top-4 right-8">
        <Link
          onClick={() => {
            showMessage("error", "Chimin Extra")
            console.log(editor?.getJSON());
          }}
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
