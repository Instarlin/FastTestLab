import { useEditor } from "@tiptap/react";
import { defaultExtensions } from "../extensions";
import { useMessage } from "~/components/ui/message";
import { uploadImage } from "../utils/uploadImg";
import json from './gg.json'

const content = json;

export const useRichEditor = () => {
  const { showMessage } = useMessage();

  const handleImageInsert = (
    view: any,
    src: string,
    event: DragEvent | ClipboardEvent
  ) => {
    const { schema } = view.state;
    let insertPos;

    // For drag events, use mouse coordinates
    if (event instanceof DragEvent && event.clientX !== undefined && event.clientY !== undefined) {
      const coords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      insertPos = coords ? coords.pos : view.state.selection.head;
    } else {
      // For clipboard events, insert at current cursor position
      insertPos = view.state.selection.head;
    }

    const node = schema.nodes.image.create({ src });
    const transaction = view.state.tr.insert(insertPos, node);
    view.dispatch(transaction);
  };

  const handleDrop = async (
    view: any,
    event: DragEvent,
    slice: unknown,
    moved: boolean
  ) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      const file = event.dataTransfer.files[0];
      const filesize = file.size / 1024 / 1024;
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        filesize < 10
      ) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          if (img.width > 5000 || img.height > 5000) {
            showMessage(
              "error",
              "Your images need to be less than 5000 pixels in height and width."
            );
          } else {
            try {
              const url = await uploadImage(file);
              handleImageInsert(view, url, event);
            } catch (e) {
              showMessage("error", "There was a problem uploading your image.");
            }
          }
        };
      } else {
        showMessage(
          "error",
          "Images need to be in jpg or png format and less than 10mb in size."
        );
      }
      return true;
    }
    return false;
  };

  const handlePaste = async (
    view: any,
    event: ClipboardEvent,
    slice: unknown
  ) => {
    const file = event.clipboardData?.files?.[0];
    if (file) {
      const filesize = file.size / 1024 / 1024;
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        filesize < 10
      ) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          if (img.width > 5000 || img.height > 5000) {
            showMessage(
              "error",
              "Your images need to be less than 5000 pixels in height and width."
            );
          } else {
            try {
              const url = await uploadImage(file);
              handleImageInsert(view, url, event);
            } catch (e) {
              showMessage("error", "There was a problem uploading your image.");
            }
          }
        };
      } else {
        showMessage(
          "error",
          "Images need to be in jpg or png format and less than 10mb in size."
        );
      }
      return true;
    }
    return false;
  };

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    editable: false,
    content: content,
    extensions: [...defaultExtensions],
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
      handleDrop: (view, event, slice, moved) => {
        handleDrop(view, event, slice, moved);
      },
      handlePaste: (view, event, slice) => {
        handlePaste(view, event, slice);
      },
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
