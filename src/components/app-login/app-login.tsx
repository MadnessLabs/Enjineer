import { Component, ComponentInterface, h, Prop, State } from "@stencil/core";

import { AuthService } from "../../helpers/auth";

@Component({
  tag: "app-login",
  styleUrl: "app-login.css",
})
export class AppLogin implements ComponentInterface {
  @Prop() auth: AuthService;
  @Prop() config: any = {};

  @State() error: string;

  async login(type: string) {
    let res;
    try {
      res = await this.auth.withSocial(type);
      if (res?.user?.uid) {
        window.location.href = "/editor/home";
      }
    } catch (error) {
      this.error = error.message;
    }
  }

  render() {
    return [
      <app-header pageTitle="Login"></app-header>,
      <ion-content class="ion-padding">
        {this.error && <ion-label color="danger">{this.error}</ion-label>}
        <ion-button onClick={() => this.login("github")} expand="block">
          <ion-icon slot="start" name="logo-github" />
          <ion-label>Sign-in With Github</ion-label>
        </ion-button>
      </ion-content>,
    ];
  }
}
