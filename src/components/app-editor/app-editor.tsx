import {
  Component,
  ComponentInterface,
  h,
  Prop,
  State
} from "@stencil/core";

import { AuthService } from "../../helpers/auth";

@Component({
  tag: "app-editor",
  styleUrl: "app-editor.css"
})
export class AppEditor implements ComponentInterface {
  @Prop() auth: AuthService;
  @Prop() config: any = {};

  @State() error: string;

  render() {
    return [
      <app-header pageTitle="Editor"></app-header>,
      <ion-content class="ion-padding">
        <enjineer-editor />
      </ion-content>
    ];
  }
}
