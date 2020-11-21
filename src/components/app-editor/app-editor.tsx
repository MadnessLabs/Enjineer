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

  @Prop() auth: AuthService;
  @Prop() config: any = {};
  @Prop() db: DatabaseService;

  @State() error: string;
  @State() session: firebase.default.User;

  @Listen("enjinChange")
  async onEditorChange(event) {
    if (this.session) {
      const currentEditor = await event.detail.instance.save();
      await this.db.document("users", this.session.uid).update({
        currentEditor,
      });
    }
  }

  async componentDidLoad() {
    this.session = this.auth.isLoggedIn();
    if (this.session) {
      const editorJS = await this.editorEl.getInstance();
      const userData = await this.db.find("users", this.session.uid);
      editorJS.blocks.render(
        userData.currentEditor ? userData.currentEditor : {}
      );
    }
  }

  openProfile() {
    window.location.href = "/profile";
  }

  render() {
    return [
      <app-header pageTitle="Enjineer">
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
                top: "-8px",
                right: "8px",
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
        <enjineer-editor ref={(el) => (this.editorEl = el)} />
      </ion-content>,
    ];
  }
}
