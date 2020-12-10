import {
  Component,
  ComponentInterface,
  h,
  Listen,
  Prop,
  State,
} from "@stencil/core";
import Debounce from "debounce-decorator";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";
import isEqual from "../../helpers/isEqual";

@Component({
  tag: "app-editor",
  styleUrl: "app-editor.css",
})
export class AppEditor implements ComponentInterface {
  editorEl: HTMLEnjineerEditorElement;
  editorJs: any;
  headerEl: HTMLAppHeaderElement;
  skipRender = false;
  page: any;
  blockIndex: number;

  @Prop() auth: AuthService;
  @Prop() config: any = {};
  @Prop() db: DatabaseService;
  @Prop() pageId: string;

  @State() error: string;
  @State() session: firebase.default.User;

  @Listen("enjinEditTitle", { target: "body" })
  async onEditTitle(event) {
    if (
      event.target === this.headerEl &&
      event?.detail?.event?.target?.textContent &&
      this.session?.uid
    ) {
      await this.db
        .document("users", this.session.uid)
        .document("pages", this.pageId)
        .update({
          name: event.detail.event.target.textContent,
        });
    }
  }

  @Listen("enjinChange")
  @Debounce(3000)
  async onEditorChange(event) {
    if (!this.session) return;
    const editor = await event.detail.instance.save();
    if (isEqual(editor?.blocks, this.page?.editor?.blocks)) return;
    if (this.pageId === "home") {
      await this.db.document("users", this.session.uid).update({
        editor,
      });
    } else {
      await this.db
        .document("users", this.session.uid)
        .document("pages", this.pageId)
        .update({
          editor,
        });
    }
  }

  async editorWatcher(doc) {
    if (isEqual(this.page, doc?.data)) return;
    this.page = doc?.data ? doc.data : null;
    this.editorJs.blocks.render(this.page.editor ? this.page.editor : {});
  }

  async componentDidLoad() {
    this.session = this.auth.isLoggedIn();
    if (this.session) {
      setTimeout(async () => {
        this.editorJs = await this.editorEl.getInstance();
        if (this.pageId === "home" && this.editorJs?.blocks?.render) {
          await this.db.watchDocument(
            "users",
            this.session.uid,
            this.editorWatcher.bind(this)
          );
        } else if (this.editorJs?.blocks?.render) {
          await this.db
            .document("users", this.session.uid)
            .watchDocument("pages", this.pageId, this.editorWatcher.bind(this));
        }
      }, 1000);
    }
  }

  async disconnectedCallback() {
    const editorJS = await this.editorEl.getInstance();
    if (
      this.session?.uid &&
      this.pageId === "home" &&
      editorJS?.blocks?.render
    ) {
      this.db.unwatchDocument("users", this.session.uid);
    } else if (this.session?.uid && editorJS?.blocks?.render) {
      this.db.unwatchDocument("pages", this.pageId);
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
