import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FC } from "react";

interface EditorProps {
  filedName: string;
  id?: string;
  onChange: (data: string, filedName: string) => void;
  placeholder?: string;
  data: string;
}

const Editor: FC<EditorProps> = ({
  id,
  filedName,
  onChange,
  placeholder = "Enter Here...",
  data,
}) => {
  const toolBar = [
    "undo",
    "redo",
    "bold",
    "italic",
    "imageTextAlternative",
    "imageUpload",
    "heading",
    "numberedList",
    "bulletedList",
    "insertTable",
    "tableColumn",
    "tableRow",
    "mergeTableCells",
  ];

  return (
    <div className={`my-2 prose`}>
      <CKEditor
        id={id}
        editor={ClassicEditor}
        config={{
          placeholder: placeholder,
          language: "en",
          toolbar: toolBar,
          ckfinder: {
            uploadUrl:
              (process.env.REACT_APP_API_URL as string) + "/single-upload",
          },
        }}
        data={data}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          // console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          onChange(editor.getData(), filedName);
        }}
        onBlur={(event, editor) => {
          // console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          // console.log("Focus.", editor);
        }}
      />
    </div>
  );
};

export default Editor;
