import {
  ComponentInterface,
  Component,
  Event,
  EventEmitter,
  h,
  Element,
  Prop,
  Method,
  Host,
} from "@stencil/core";
import firebase from "firebase/app";
import "firebase/storage";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import DragDrop from "editorjs-drag-drop";
import Header from "@editorjs/header";
import Paragraph from "editorjs-paragraph-with-alignment";
import Table from "@editorjs/table";
import { MDParser, MDImporter } from "editorjsMdParser";
import Button from "./blocks/Button";
import EditorJSStyle from "editorjs-style";
import SplitPane from "./blocks/SplitPane";

@Component({
  tag: "enjineer-editor",
  styleUrl: "editor.css",
})
export class EnjineerEditor implements ComponentInterface {
  editorJS: EditorJS;

  @Element() editorEl: HTMLEnjineerEditorElement;

  @Prop() placeholder = "Let's Write Something!";
  @Prop() userId: string;

  @Event() enjinChange: EventEmitter;

  @Method()
  async getInstance(): Promise<any> {
    return this.editorJS;
  }

  componentDidLoad() {
    this.editorJS = new EditorJS({
      onReady: () => {
        new DragDrop(this.editorJS);
      },
      onChange: () => {
        this.enjinChange.emit({ instance: this.editorJS });
      },
      placeholder: this.placeholder,
      holder: this.editorEl,
      tools: {
        button: {
          class: Button,
        },
        editorJSStyle: EditorJSStyle,
        splitPane: {
          class: SplitPane,
        },
        table: {
          class: Table,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        markdownParser: MDParser,
        markdownImporter: MDImporter,
        header: {
          class: Header,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: (file) => {
                return new Promise((resolve, reject) => {
                  const uploadTask = firebase
                    .storage()
                    .ref(`/users/${this.userId}/${file.name}`)
                    .put(file, {});
                  uploadTask.on(
                    "state_changed",
                    function (snapshot) {
                      var progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log("Upload is " + progress + "% done");
                      switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log("Upload is paused");
                          break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log("Upload is running");
                          break;
                      }
                    },
                    function (error) {
                      reject(error);
                    },
                    function () {
                      uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then(function (url) {
                          resolve({
                            success: true,
                            file: {
                              url,
                            },
                          });
                        });
                    }
                  );
                });
              },

              /**
               * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
               * @param {string} url - pasted image URL
               * @return {Promise.<{success, file: {url}}>}
               */
              uploadByUrl: async (url) => ({
                success: true,
                file: {
                  url,
                },
              }),
            },
          },
        },
      },
    });
  }

  render() {
    return <Host />;
  }
}
