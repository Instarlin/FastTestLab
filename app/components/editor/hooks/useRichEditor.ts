import { useEditor } from "@tiptap/react";
import { defaultExtensions } from "../extensions";
import Placeholder from "@tiptap/extension-placeholder";

const content = `
<img src="https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"/>
<h1>Here is your new awesome <mark>canvas</mark>!</h1>
<h2>Here is your new awesome <mark>canvas</mark>!</h2>
<h3>Here is your new awesome <mark>canvas</mark>!</h3>
<p>Here is your new awesome <mark>canvas</mark>!</p>
<ul>
  <li>Here is your new awesome <mark>canvas</mark>!</li>
  <li>Here is your new awesome <mark>canvas</mark>!</li>
</ul>
`

export const useRichEditor = () => {
  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      content: content,
      extensions: [
        ...defaultExtensions,
        Placeholder.configure({
          placeholder: "Type / for commands...",
        })
      ],
      editorProps: {
        attributes: {
          spellcheck: "false",
        },
        handleDrop(view, event, slice, moved) {
          if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            let file = event.dataTransfer.files[0];
            let filesize = ((file.size/1024)/1024).toFixed(4);
            if ((file.type === "image/jpeg" || file.type === "image/png") && Number(filesize) < 10) {
              let _URL = window.URL || window.webkitURL;
              let img = new Image();
              img.src = _URL.createObjectURL(file);
              img.onload = function () {
                if (img.width > 5000 || img.height > 5000) {
                  window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
                } else {
                  // uploadImage(file).then(function(response : string) {
                  //   let image = new Image();
                  //   image.src = response;
                  //   image.onload = function() {
                  //     const { schema } = view.state;
                  //     const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  //     const node = schema.nodes.image.create({ src: response });
                  //     const transaction = view.state.tr.insert(coordinates!.pos, node);
                  //     return view.dispatch(transaction);
                  //   }
                  // }).catch(function(error: Error) {
                  //   if (error) {
                  //     window.alert("There was a problem uploading your image, please try again.");
                  //   }
                  // });
                  console.log(file)
                  // toast.success("Image uploaded successfully!");
                }
              };
            } else {
              window.alert("Images need to be in jpg or png format and less than 10mb in size.");
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
        console.log(transaction);
      }
    },
  )

  // window.editor = editor

  return { editor }
}

export default useRichEditor