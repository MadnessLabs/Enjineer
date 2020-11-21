import { Component, ComponentInterface, h, Prop, State } from "@stencil/core";

import { AuthService } from "../../helpers/auth";

@Component({
  tag: "app-editor",
  styleUrl: "app-editor.css",
})
export class AppEditor implements ComponentInterface {
  @Prop() auth: AuthService;
  @Prop() config: any = {};

  @State() error: string;
  @State() session: firebase.default.User;

  componentDidLoad() {
    this.session = this.auth.isLoggedIn();
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
        <enjineer-editor />
      </ion-content>,
    ];
  }
}
