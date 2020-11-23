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

  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;
  @Prop() config: any;

  @State() pages: any[] = [];

  async addPage(event) {
    if (!this.auth?.isLoggedIn()) return;
    const newPage = await this.db.collection("pages").add({
      name: `New Page - ${this.timestamp.getFullYear()}/${
        this.timestamp.getMonth() + 1
      }/${this.timestamp.getDate()}`,
      users: [this.auth.isLoggedIn().uid],
    });
    console.log(newPage);
    await this.fetchPages();
    this.enjinToggleMenu.emit({ event });
    window.location.href = `/editor/${newPage.id}`;

    return newPage;
  }

  async fetchPages() {
    if (!this.auth?.isLoggedIn()) return;
    this.pages = (
      await this.db
        .collection("pages")
        .where("users", "array-contains", this.auth.isLoggedIn().uid)
        .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(this.pages);
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
          href="/editor/home"
          onClick={(event) => this.enjinToggleMenu.emit({ event })}
        >
          <ion-icon slot="start" name="home" />
          <ion-label>Home</ion-label>
        </ion-item>
        {this.pages.map((page) => (
          <ion-item
            href={`/editor/${page.id}`}
            detail
            onClick={(event) => this.enjinToggleMenu.emit({ event })}
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
