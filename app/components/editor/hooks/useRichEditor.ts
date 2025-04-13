import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import { defaultExtensions } from "../extensions";

const content = `
<img src="https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"/>
<h1>Использование текстового редактора</h1>
<h2>Взаимодействие с текстом</h2>
<p>Чтобы изменить внешний вид текста или поменять раположение нужно выделить участок текста. После этого появится меню взаимодействия. Стили можно смешивать.</p>
<p>Так же для более удобного пользования редактором есть команды</p>
<ul>
  <li>Жирный текст <code>Ctrl + B</code></li>
  <li>Курсив <code>Ctrl + I</code></li>
  <li>Подчеркнутый текст <code>Ctrl + U</code></li>
  <li>Зачеркнутый текст <code>Ctrl + Shift + S</code></li>
</ul>
<h2>Создание новых блоков</h2>
<p>Новый блок можно создать используя команду написав <code>/</code> с новой строчки.</p>
<p>Список всех возможных команд:</p>
<ul>
  <li>Заголовки 3-х уровней</li>
  <li>Нумерованный список</li>
  <li>Ненумерованный список</li>
  <li>Цитата</li>
  <li>Таблица</li>
  <li>Горизонтальный разделитель</li>
</ul>
<p>Так же добавление или изменение типов блоков возможно с помощью таких команд:</p>
<ul>
  <li>Заголовок 1-ого уровня <code>Ctrl + Alt + 1</code></li>
  <li>Заголовок 2-ого уровня <code>Ctrl + Alt + 2</code></li>
  <li>Заголовок 3-ого уровня <code>Ctrl + Alt + 3</code></li>
  <p>Точно так же заголовки можно создать, если начать новую строку с <code>#</code> <code>##</code> <code>###</code></p>
  <li>Выделить текст <code>Ctrl + 4</code></li>
</ul>
<h2>Добавление изображений</h2>
<p>Для добавления изображений его можно просто перетащить в сам редактор или же сделать это с помощью команды</p>
<h2>Интерфейс программы</h2>
<p>Слева находится счетчик слов и символов, справа же навигация по документу. Она выстраивается из заголовков. Заголовки более низкого уровня вкладываются в более высокие.</p>
`;

export const useRichEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    content: content,
    extensions: [
      ...defaultExtensions,
      Placeholder.configure({
        placeholder: "Type / for commands...",
      }),
    ],
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
                ); // display alert
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
                console.log(file);
                // toast.success("Image uploaded successfully!");
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
      // console.log(transaction.docChanged);
    },
  });

  return { editor };
};

export default useRichEditor;
