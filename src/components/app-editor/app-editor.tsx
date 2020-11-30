import {
  Component,
  ComponentInterface,
  h,
  Listen,
  Prop,
  State,
} from "@stencil/core";

import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";

@Component({
  tag: "app-editor",
  styleUrl: "app-editor.css",
})
export class AppEditor implements ComponentInterface {
  editorEl: HTMLEnjineerEditorElement;
  headerEl: HTMLAppHeaderElement;

  @Prop() auth: AuthService;
  @Prop() config: any = {};
  @Prop() db: DatabaseService;
  @Prop() pageId: string;

  @State() error: string;
  @State() session: firebase.default.User;
  @State() page: any;

  @Listen("enjinEditTitle", { target: "body" })
  async onEditTitle(event) {
    if (
      event.target === this.headerEl &&
      event?.detail?.event?.target?.textContent
    ) {
      await this.db.document("pages", this.pageId).update({
        name: event.detail.event.target.textContent,
      });
    }
  }

  @Listen("enjinChange")
  async onEditorChange(event) {
    if (!this.session) return;
    const currentEditor = await event.detail.instance.save();
    if (this.pageId === "home") {
      await this.db.document("users", this.session.uid).update({
        currentEditor,
      });
    } else {
      await this.db.document("pages", this.pageId).update({
        editor: currentEditor,
      });
    }
  }

  async componentDidLoad() {
    this.session = this.auth.isLoggedIn();
    if (this.session) {
      setTimeout(async () => {
        const editorJS = await this.editorEl.getInstance();
        if (this.pageId === "home") {
          const userData = await this.db.find("users", this.session.uid);
          if (editorJS?.blocks?.render && userData?.id) {
            editorJS.blocks.render(
              userData.currentEditor ? userData.currentEditor : {}
            );
          }
        } else {
          if (editorJS?.blocks?.render) {
            this.page = await this.db.find("pages", this.pageId);
            editorJS.blocks.render(this.page.editor ? this.page.editor : {});
          }
        }
      }, 1000);
    }
  }

  openProfile() {
    const routerEl = document.querySelector("ion-router");
    routerEl.push("/profile");
  }

  render() {
    return [
      <app-header
        ref={(el) => (this.headerEl = el)}
        pageTitle={this.page?.name ? this.page.name : "Enjineer"}
        editable={this.page?.name}
      >
        {this.session ? (
          <ion-avatar slot="end">
            <img
              onClick={() => this.openProfile()}
              src={this.session?.photoURL}
              style={{
                cursor: "pointer",
                height: "50px",
                width: "50px",
                position: "absolute",
                top: "3px",
                right: "15px",
                boxShadow:
                  "0 1px 3px -1px rgba(0, 0, 0, 0.2), 0 3px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)",
              }}
            />
          </ion-avatar>
        ) : (
          <ion-button href="/login" slot="end">
            Login
          </ion-button>
        )}
      </app-header>,
      <ion-content class="ion-padding">
        <enjineer-editor
          ref={(el) => (this.editorEl = el)}
          userId={this.session?.uid}
        />
      </ion-content>,
    ];
  }
}
