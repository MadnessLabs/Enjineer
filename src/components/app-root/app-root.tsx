import "split-me";
import { ComponentInterface, Build, Component, Listen, h } from "@stencil/core";

import env from "../../helpers/env";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";
import { popoverController } from "@ionic/core";

@Component({
  tag: "app-root",
  styleUrl: "app-root.css",
})
export class AppRoot implements ComponentInterface {
  menuPopoverEl: HTMLIonPopoverElement;
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

  @Listen("onDidDismiss", { target: "body" })
  onMenuDismiss() {
    this.menuPopoverEl = null;
  }

  @Listen("enjinToggleMenu")
  async onToggleMenu(event) {
    if (this.menuPopoverEl) {
      await this.menuPopoverEl.dismiss();
      this.menuPopoverEl = null;
      return;
    }
    this.menuPopoverEl = await popoverController.create({
      component: "app-menu",
      componentProps: {
        db: this.db,
        auth: this.auth,
        config: this.config,
      },
      event,
    });
    return this.menuPopoverEl.present();
  }

  @Listen("ionRouteWillChange")
  onRouteWillChange(event) {
    if (event.detail.to.includes("/editor/")) {
      document.querySelector("app-dashboard").remove();
    }
    return true;
  }

  @Listen("ionRouteDidChange")
  onRouteDidChange(event) {
    if (!Build.isBrowser) return false;

    if (this.stopLoader) {
      document.querySelector("app-root").classList.add("is-loaded");
      this.stopLoader = false;
    }

    if (event?.detail?.to === "/" && this.auth?.isLoggedIn()) {
      window.location.href = "/editor/home";
    }

    return true;
  }

  async componentWillLoad() {
    if (Build.isBrowser) {
      this.session = this.auth.isLoggedIn();
      this.auth.onAuthChanged((session: firebase.default.User) => {
        if (session && session.uid) {
          this.session = session;
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
            component="app-login"
            componentProps={this.defaultProps}
          />
          <ion-route
            url="/editor/:pageId"
            component="app-editor"
            componentProps={this.defaultProps}
          />
          <ion-route
            url="/login"
            component="app-login"
            componentProps={this.defaultProps}
          />
          <ion-route
            url="/dashboard"
            component="app-dashboard"
            componentProps={this.defaultProps}
          />
          <ion-route
            url="/profile"
            component="app-profile"
            componentProps={this.defaultProps}
          />
        </ion-router>
        <ion-nav id="app-content" />
      </ion-app>
    );
  }
}
