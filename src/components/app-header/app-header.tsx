import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Listen,
} from "@stencil/core";

@Component({
  tag: "app-header",
  styleUrl: "app-header.css",
})
export class AppHeader implements ComponentInterface {
  hasTitleSlot: boolean;
  hasEndSlot: boolean;
  hasStartSlot: boolean;

  @Element() hostElement: HTMLElement;

  @Event() enjinToggleMenu: EventEmitter;
  @Event() enjinEditTitle: EventEmitter;

  @Prop() pageTitle: string;
  @Prop() editable = false;

  @Listen("input")
  onInput(event) {
    this.enjinEditTitle.emit({ event });
  }

  componentWillLoad() {
    this.hasEndSlot = !!this.hostElement.querySelector('[slot="end"]');
    this.hasStartSlot = !!this.hostElement.querySelector('[slot="start"]');
    this.hasTitleSlot = !!this.hostElement.querySelector('[slot="title"]');
  }

  render() {
    return (
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            {this.hasStartSlot ? (
              <slot name="start" />
            ) : (
              <ion-fab-button
                onClick={(event) => this.enjinToggleMenu.emit({ event })}
              >
                <ion-icon color="dark" src="/assets/icon/icon.svg" />
              </ion-fab-button>
            )}
          </ion-buttons>
          <ion-title contentEditable={this.editable}>
            {this.hasTitleSlot ? (
              <slot name="title" />
            ) : this.pageTitle ? (
              this.pageTitle
            ) : (
              "Enjineer"
            )}
          </ion-title>
          <ion-buttons
            class={{
              "custom-buttons": this.hasEndSlot,
            }}
            slot="end"
          >
            <slot name="end" />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    );
  }
}
