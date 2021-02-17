import { toastController } from "@ionic/core";
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
import isEqual from "../../helpers/isEqual";

@Component({
  tag: "app-editor",
  styleUrl: "app-editor.css",
})
export class AppEditor implements ComponentInterface {
  editorEl: any;
  editorJs: any;
  headerEl: HTMLAppHeaderElement;
  skipRender = false;
  blockIndex: number;
  pageRef: firebase.default.firestore.DocumentReference;
  pageSubscription: any;
  toastEl: HTMLIonToastElement;
  editorSaveData: any;

  @Prop() auth: AuthService;
  @Prop() config: any = {};
  @Prop() db: DatabaseService;
  @Prop() pageId: string;

  @State() page: any;
  @State() error: string;
  @State() session: firebase.default.User;

  @Listen("enjinEditTitle", { target: "body" })
  async onEditTitle(event) {
    if (
      event.target === this.headerEl &&
      event?.detail?.event?.target?.textContent &&
      this.session?.uid
    ) {
      let docRef = this.db.collection("users").doc(this.session.uid);
      if (this.pageId !== "home") {
        if (this.pageId.includes(":")) {
          const pageIds = this.pageId.split(":");
          for (const pageId of pageIds) {
            docRef = docRef.collection("pages").doc(pageId);
          }
        } else {
          docRef = docRef.collection("pages").doc(this.pageId);
        }
      }

      await docRef.update({
        name: event.detail.event.target.textContent,
      });
    }
  }

  @Listen("enjinChange")
  async onEditorChange(event) {
    if (!this.session) return;
    const editor = await event.detail.instance.save();
    this.editorSaveData = editor;
    if (isEqual(editor?.blocks, this.page?.editor?.blocks)) return;
    if (this.pageId === "home") {
      await this.db.document("users", this.session.uid).update({
        editor,
      });
    } else {
      let docRef = this.db.collection("users").doc(this.session.uid);
      if (this.pageId.includes(":")) {
        const pageIds = this.pageId.split(":");
        for (const pageId of pageIds) {
          docRef = docRef.collection("pages").doc(pageId);
        }
      } else {
        docRef = docRef.collection("pages").doc(this.pageId);
      }
      await docRef.update({
        editor,
      });
    }
  }

  openProfile() {
    const routerEl = document.querySelector("ion-router");
    routerEl.push("/profile");
  }

  async fetchPage(page?: any) {
    this.page = page ? page : (await this.pageRef.get()).data();
    this.editorJs.blocks.render(this.page?.editor ? this.page.editor : {});
  }

  async componentDidLoad() {
    this.session = this.auth.isLoggedIn();
    if (this.session) {
      setTimeout(async () => {
        this.editorJs = await this.editorEl.getInstance();
        this.pageRef = this.db.collection("users").doc(this.session.uid);
        if (this.pageId !== "home") {
          if (this.pageId.includes(":")) {
            const pageIds = this.pageId.split(":");
            for (const pageId of pageIds) {
              this.pageRef = this.pageRef.collection("pages").doc(pageId);
            }
          } else if (this.pageId && !this.pageId.includes(":")) {
            this.pageRef = this.pageRef.collection("pages").doc(this.pageId);
          }
        }
        await this.fetchPage();
        this.pageSubscription = this.pageRef.onSnapshot(async (doc) => {
          if (
            this.editorSaveData?.blocks &&
            this.editorSaveData?.time !== doc.data()?.editor?.time
          ) {
            this.toastEl = await toastController.create({
              message: "Page has been updated, sync now?",
              buttons: [
                {
                  text: "Yes",
                  handler: () => {
                    this.fetchPage();
                    this.toastEl.dismiss();
                  },
                },
                {
                  text: "Ignore",
                  handler: () => {
                    this.toastEl.dismiss();
                  },
                },
              ],
            });
            this.toastEl.present();
          }
        });
      }, 1000);
    }
  }

  async disconnectedCallback() {
    this.pageSubscription();
  }

  render() {
    return [
      <app-header
        ref={(el) => (this.headerEl = el)}
        pageTitle={this.page?.name ? this.page.name : "Enjineer"}
        editable={this.pageId !== "home"}
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
        <enjin-editor
          ref={(el) => (this.editorEl = el)}
          userId={this.session?.uid}
        />
      </ion-content>,
    ];
  }
}
