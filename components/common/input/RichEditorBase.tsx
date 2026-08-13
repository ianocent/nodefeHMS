import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Editor } from "@tinymce/tinymce-react";
const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};
interface RichEditorBaseProps {
  label: string;
  required?: boolean;
  onChange: (e: any) => void;
  value?: any;
}
interface EditorRef {
  CKEditor: any;
  ClassicEditor: any;
}
const RichEditorBase = (props: RichEditorBaseProps) => {
  const { label, onChange, required, value } = props;

  return (
    <div className="flex flex-col gap-1">
      <label className="font-bold text-[14px] capitalize leading-[19px]">
        {label}{" "}
        {required ? (
          <span className="text-red normal-case">* required</span>
        ) : null}
      </label>

      {/* <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        onChange={(event, editor) => {
          console.log(editor.getData());
          onChange(editor.getData());
        }}
      /> */}
      <Editor
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        //  onInit={(evt, editor) => editorRef.current = editor}
        onKeyUp={(e) => {
          //console.log("logs1a", e.target.getContent());
          // onChange(e.target.getContent());
          // onChange(e.target.innerHTML);
        }}
        onEditorChange={(e) => {
          onChange(e);
        }}
        // onChange={(e) => {
        //   onChange(e.target.getContent());
        // }}
        // initialValue="<p>This is the initial content of the editor.</p>"
        value={value}
        init={{
          height: 200,
          plugins:
            "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
          editimage_cors_hosts: ["picsum.photos"],
          menubar: "file edit view insert format tools table help",
          toolbar:
            "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: false,
          autosave_retention: "2m",
          image_advtab: true,
          extended_valid_elements: "*[*]",
          font_size_formats: "8px 10px 12px 14px 18px 24px 36px",
          link_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_class_list: [
            { title: "None", value: "" },
            { title: "Some class", value: "class-name" },
          ],
          importcss_append: true,
          file_picker_callback: (callback, value, meta) => {
            /* Provide file and text for the link dialog */
            if (meta.filetype === "file") {
              callback("https://www.google.com/logos/google.jpg", {
                text: "My text",
              });
            }

            /* Provide image and alt text for the image dialog */
            if (meta.filetype === "image") {
              callback("https://www.google.com/logos/google.jpg", {
                alt: "My alt text",
              });
            }

            /* Provide alternative source and posted for the media dialog */
            if (meta.filetype === "media") {
              callback("movie.mp4", {
                source2: "alt.ogg",
                poster: "https://www.google.com/logos/google.jpg",
              });
            }
          },
          templates: [
            {
              title: "New Table",
              description: "creates a new table",
              content:
                '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
            },
            {
              title: "Starting my story",
              description: "A cure for writers block",
              content: "Once upon a time...",
            },
            {
              title: "New list with dates",
              description: "New List with dates",
              content:
                '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
            },
          ],
          template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
          template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",

          image_caption: true,
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          noneditable_class: "mceNonEditable",
          toolbar_mode: "sliding",
          contextmenu: "link image table",
          skin: "oxide",
          content_css: "default",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
      />
    </div>
  );
};

export default RichEditorBase;
