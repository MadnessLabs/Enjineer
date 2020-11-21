import {
  ComponentInterface,
  Component,
  Event,
  EventEmitter,
  h,
  Prop,
} from "@stencil/core";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import DragDrop from "editorjs-drag-drop";
import Header from "@editorjs/header";
import Paragraph from "editorjs-paragraph-with-alignment";
import Table from "@editorjs/table";
import Button from "./blocks/Button";

@Component({
  tag: "enjineer-editor",
  styleUrl: "editor.css",
})
export class EnjineerEditor implements ComponentInterface {
  editorJS: EditorJS;

  @Prop() placeholder = "Let's Write Something!";

  @Event() enjinChange: EventEmitter;

  componentDidLoad() {
    this.editorJS = new EditorJS({
      onReady: () => {
        new DragDrop(this.editorJS);
      },
      onChange: () => {
        this.enjinChange.emit({ instance: this.editorJS });
      },
      placeholder: this.placeholder,
      tools: {
        button: {
          class: Button,
        },
        table: {
          class: Table,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        header: Header,
        embed: {
          class: Embed,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
              byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
            },
          },
        },
      },
    });
  }

  render() {
    return <div id="editorjs"></div>;
  }
}
