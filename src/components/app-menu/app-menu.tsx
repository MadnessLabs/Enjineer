import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";

@Component({
  tag: "app-menu",
  styleUrl: "app-menu.css",
})
export class AppMenu {
  timestamp = new Date();
  level = 1;

  @Event() enjinToggleMenu: EventEmitter;
  @Event() enjinSelectPage: EventEmitter;

  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;
  @Prop() config: any;
  @Prop() selectingPage = false;
  @Prop() blockIndex: number;
  @Prop() pages: any[] = [];

  @State() expandedPages = [];

  async addPage(event) {
    const session = this.auth?.isLoggedIn();
    if (!session) return;
    const newPage = await this.db
      .document("users", session.uid)
      .collection("pages")
      .add({
        name: `New Page - ${this.timestamp.getFullYear()}/${
          this.timestamp.getMonth() + 1
        }/${this.timestamp.getDate()}`,
        users: [this.auth.isLoggedIn().uid],
      });
    this.enjinToggleMenu.emit({ event });
    if (this.selectingPage) {
      this.enjinSelectPage.emit({
        event,
        page: newPage,
        blockIndex: this.blockIndex,
      });
    } else {
      const routerEl = document.querySelector("ion-router");
      if (routerEl) {
        routerEl.push(`/editor/${newPage.id}`);
      }
    }

    return newPage;
  }

  async itemClick(event, page) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectingPage) {
      this.enjinSelectPage.emit({ event, page, blockIndex: this.blockIndex });
    }
    this.enjinToggleMenu.emit({ event });
  }

  pathToHref(path: string) {
    const session = this.auth.isLoggedIn();
    return (
      `/editor/` +
      path
        .split("/")
        .filter((part) => !["users", "pages", session.uid].includes(part))
        .join(":")
    );
  }

  renderPageItem(page) {
    return [
      <ion-item
        href={this.selectingPage ? "#" : this.pathToHref(page.ref.path)}
        detail
        onClick={(event) => this.itemClick(event, page)}
      >
        {page.pages?.length ? (
          <ion-icon
            slot="start"
            name={
              this.expandedPages.includes(page.id)
                ? "caret-up-circle-outline"
                : "caret-down-circle-outline"
            }
            style={{ marginRight: "5px" }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (this.expandedPages.includes(page.id)) {
                delete this.expandedPages[this.expandedPages.indexOf(page.id)];
              } else {
                this.expandedPages.push(page.id);
              }
              this.expandedPages = [...this.expandedPages];
            }}
          />
        ) : null}
        <ion-label>{page.name}</ion-label>
      </ion-item>,
      page.pages?.length > 0 ? (
        <ion-list
          style={{
            paddingLeft: "10px",
            display: this.expandedPages.includes(page.id) ? "block" : "none",
          }}
        >
          {page.pages.map((subPage) => this.renderPageItem(subPage))}
        </ion-list>
      ) : null,
    ];
  }

  render() {
    return (
      <ion-list>
        <ion-item
          detail
          href={this.selectingPage ? "#" : "/editor/home"}
          onClick={(event) => this.itemClick(event, null)}
        >
          <ion-icon slot="start" name="home" />
          <ion-label>Home</ion-label>
        </ion-item>
        {this.pages.map((page) => this.renderPageItem(page))}
        <ion-item
          href="#"
          lines="none"
          onClick={(event) => this.addPage(event)}
        >
          <ion-label style={{ color: "var(--ion-color-primary)" }}>
            Add Page
          </ion-label>
          <ion-icon name="add-circle" color="primary" slot="end" />
        </ion-item>
      </ion-list>
    );
  }
}
