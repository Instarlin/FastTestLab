import { useEditor } from "@tiptap/react";
import { defaultExtensions } from "../extensions";
import json from './gg.json'

const content = json;

export const useRichEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    editable: false,
    content: content,
    extensions: [ ...defaultExtensions ],
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
      handleDrop(view, event, slice, moved) {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          let file = event.dataTransfer.files[0];
          let filesize = (file.size / 1024 / 1024).toFixed(4);
          if (
            (file.type === "image/jpeg" || file.type === "image/png") &&
            Number(filesize) < 10
          ) {
            let _URL = window.URL || window.webkitURL;
            let img = new Image();
            img.src = _URL.createObjectURL(file);
            img.onload = function () {
              if (img.width > 5000 || img.height > 5000) {
                window.alert(
                  "Your images need to be less than 5000 pixels in height and width."
                );
              } else {
                console.log(file);
              }
            };
          } else {
            window.alert(
              "Images need to be in jpg or png format and less than 10mb in size."
            );
          }
          return true;
        }
        return false;
      },
      handlePaste(view, event, slice) {},
    },

    onContentError: ({ error }) => {
      console.error(error);
    },

    onTransaction: ({ editor, transaction }) => {
      // console.log(editor.getHTML());
    },
  });

  return { editor };
};

export default useRichEditor;
