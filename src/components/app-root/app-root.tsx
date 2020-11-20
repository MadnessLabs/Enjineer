import { ComponentInterface, Build, Component, Listen, h } from "@stencil/core";

import env from "../../helpers/env";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";

const onBeforeEnter = async () => {
  console.log("before enter");
  return true;
};

const onBeforeLeave = async () => {
  console.log("before leave");
  return true;
};

@Component({
  tag: "app-root",
  styleUrl: "app-root.css",
})
export class AppRoot implements ComponentInterface {
  stopLoader = true;
  sharePopover: HTMLIonPopoverElement;
  routerEl: HTMLIonRouterElement;
  config = env();
  isCordova = window && (window as any).cordova ? true : false;
  modal: HTMLIonModalElement;
  auth = Build.isBrowser
    ? new AuthService({
        ...this.config,
      })
    : null;
  db = new DatabaseService();
  session: firebase.default.User;
  defaultProps: {
    auth: AuthService;
    config: any;
    db: DatabaseService;
  } = {
    auth: this.auth,
    config: this.config,
    db: this.db,
  };

  @Listen("ionRouteDidChange")
  onRouteDidChange() {
    if (!Build.isBrowser) {
      return false;
    }

    if (this.stopLoader) {
      document.querySelector("app-root").classList.add("is-loaded");
      this.stopLoader = false;
    }
  }

  async componentWillLoad() {
    if (Build.isBrowser) {
      this.session = this.auth.isLoggedIn();
      this.auth.onAuthChanged((session: firebase.default.User) => {
        if (session && session.uid) {
          this.session = session;
          console.log(session);
          this.db.watchDocument("users", session.uid, async (snapshot) => {
            if (!snapshot?.data) {
              await this.db.document("users", session.uid).set({
                id: session.uid,
                isRegistered: true,
                email: session.email,
                displayName: session.displayName,
                photo: session.photoURL,
                phone: session.phoneNumber,
              });
            }
          });
        }
      });
    }
  }

  render() {
    return (
      <ion-app>
        <ion-router
          ref={(el) => (this.routerEl = el)}
          useHash={
            this.isCordova &&
            (window as any).Ionic.platforms.indexOf("android") === -1
          }
        >
          {this.isCordova && <ion-route-redirect from="/" to="/login" />}
          {this.isCordova && (
            <ion-route-redirect from="/index.html" to="/login" />
          )}
          <ion-route
            url="/"
            component="app-editor"
            componentProps={this.defaultProps}
            beforeLeave={onBeforeLeave}
            beforeEnter={onBeforeEnter}
          />
          <ion-route
            url="/editor"
            component="app-editor"
            componentProps={this.defaultProps}
            beforeLeave={onBeforeLeave}
            beforeEnter={onBeforeEnter}
          />
          <ion-route
            url="/login"
            component="app-login"
            componentProps={this.defaultProps}
            beforeLeave={onBeforeLeave}
            beforeEnter={onBeforeEnter}
          />
          <ion-route
            url="/dashboard"
            component="app-dashboard"
            componentProps={this.defaultProps}
            beforeLeave={onBeforeLeave}
            beforeEnter={onBeforeEnter}
          />
          <ion-route
            url="/profile"
            component="app-profile"
            componentProps={this.defaultProps}
            beforeLeave={onBeforeLeave}
            beforeEnter={onBeforeEnter}
          />
        </ion-router>
        <ion-nav id="app-content" />
      </ion-app>
    );
  }
}
