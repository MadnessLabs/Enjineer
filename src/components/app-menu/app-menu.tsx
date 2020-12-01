import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";

@Component({
  tag: "app-menu",
  styleUrl: "app-menu.css",
})
export class AppMenu {
  timestamp = new Date();

  @Event() enjinToggleMenu: EventEmitter;
  @Event() enjinSelectPage: EventEmitter;

  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;
  @Prop() config: any;
  @Prop() selectingPage = false;
  @Prop() blockIndex: number;

  @State() pages: any[] = [];

  async addPage(event) {
    if (!this.auth?.isLoggedIn()) return;
    const newPage = await this.db.collection("pages").add({
      name: `New Page - ${this.timestamp.getFullYear()}/${
        this.timestamp.getMonth() + 1
      }/${this.timestamp.getDate()}`,
      users: [this.auth.isLoggedIn().uid],
    });
    await this.fetchPages();
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

  async fetchPages() {
    if (!this.auth?.isLoggedIn()) return;
    this.pages = (
      await this.db
        .collection("pages")
        .where("users", "array-contains", this.auth.isLoggedIn().uid)
        .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return this.pages;
  }

  componentDidLoad() {
    this.fetchPages();
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
        {this.pages.map((page) => (
          <ion-item
            href={this.selectingPage ? "#" : `/editor/${page.id}`}
            detail
            onClick={(event) => this.itemClick(event, page)}
          >
            <ion-icon name="document" slot="start" />
            <ion-label>{page.name}</ion-label>
          </ion-item>
        ))}
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
