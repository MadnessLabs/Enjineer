/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AuthService } from "./helpers/auth";
import { DatabaseService } from "./helpers/database";
export namespace Components {
    interface AppDashboard {
        "auth": AuthService;
        "db": DatabaseService;
    }
    interface AppEditor {
        "auth": AuthService;
        "config": any;
        "db": DatabaseService;
        "pageId": string;
    }
    interface AppHeader {
        "editable": boolean;
        "pageTitle": string;
    }
    interface AppLogin {
        "auth": AuthService;
        "config": any;
    }
    interface AppMenu {
        "auth": AuthService;
        "blockIndex": number;
        "config": any;
        "db": DatabaseService;
        "selectingPage": boolean;
    }
    interface AppProfile {
        "auth": AuthService;
        "db": DatabaseService;
    }
    interface AppRoot {
    }
    interface EnjineerEditor {
        "getInstance": () => Promise<any>;
        "placeholder": string;
        "userId": string;
    }
}
declare global {
    interface HTMLAppDashboardElement extends Components.AppDashboard, HTMLStencilElement {
    }
    var HTMLAppDashboardElement: {
        prototype: HTMLAppDashboardElement;
        new (): HTMLAppDashboardElement;
    };
    interface HTMLAppEditorElement extends Components.AppEditor, HTMLStencilElement {
    }
    var HTMLAppEditorElement: {
        prototype: HTMLAppEditorElement;
        new (): HTMLAppEditorElement;
    };
    interface HTMLAppHeaderElement extends Components.AppHeader, HTMLStencilElement {
    }
    var HTMLAppHeaderElement: {
        prototype: HTMLAppHeaderElement;
        new (): HTMLAppHeaderElement;
    };
    interface HTMLAppLoginElement extends Components.AppLogin, HTMLStencilElement {
    }
    var HTMLAppLoginElement: {
        prototype: HTMLAppLoginElement;
        new (): HTMLAppLoginElement;
    };
    interface HTMLAppMenuElement extends Components.AppMenu, HTMLStencilElement {
    }
    var HTMLAppMenuElement: {
        prototype: HTMLAppMenuElement;
        new (): HTMLAppMenuElement;
    };
    interface HTMLAppProfileElement extends Components.AppProfile, HTMLStencilElement {
    }
    var HTMLAppProfileElement: {
        prototype: HTMLAppProfileElement;
        new (): HTMLAppProfileElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLEnjineerEditorElement extends Components.EnjineerEditor, HTMLStencilElement {
    }
    var HTMLEnjineerEditorElement: {
        prototype: HTMLEnjineerEditorElement;
        new (): HTMLEnjineerEditorElement;
    };
    interface HTMLElementTagNameMap {
        "app-dashboard": HTMLAppDashboardElement;
        "app-editor": HTMLAppEditorElement;
        "app-header": HTMLAppHeaderElement;
        "app-login": HTMLAppLoginElement;
        "app-menu": HTMLAppMenuElement;
        "app-profile": HTMLAppProfileElement;
        "app-root": HTMLAppRootElement;
        "enjineer-editor": HTMLEnjineerEditorElement;
    }
}
declare namespace LocalJSX {
    interface AppDashboard {
        "auth"?: AuthService;
        "db"?: DatabaseService;
    }
    interface AppEditor {
        "auth"?: AuthService;
        "config"?: any;
        "db"?: DatabaseService;
        "pageId"?: string;
    }
    interface AppHeader {
        "editable"?: boolean;
        "onEnjinEditTitle"?: (event: CustomEvent<any>) => void;
        "onEnjinToggleMenu"?: (event: CustomEvent<any>) => void;
        "pageTitle"?: string;
    }
    interface AppLogin {
        "auth"?: AuthService;
        "config"?: any;
    }
    interface AppMenu {
        "auth"?: AuthService;
        "blockIndex"?: number;
        "config"?: any;
        "db"?: DatabaseService;
        "onEnjinSelectPage"?: (event: CustomEvent<any>) => void;
        "onEnjinToggleMenu"?: (event: CustomEvent<any>) => void;
        "selectingPage"?: boolean;
    }
    interface AppProfile {
        "auth"?: AuthService;
        "db"?: DatabaseService;
    }
    interface AppRoot {
    }
    interface EnjineerEditor {
        "onEnjinChange"?: (event: CustomEvent<any>) => void;
        "placeholder"?: string;
        "userId"?: string;
    }
    interface IntrinsicElements {
        "app-dashboard": AppDashboard;
        "app-editor": AppEditor;
        "app-header": AppHeader;
        "app-login": AppLogin;
        "app-menu": AppMenu;
        "app-profile": AppProfile;
        "app-root": AppRoot;
        "enjineer-editor": EnjineerEditor;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-dashboard": LocalJSX.AppDashboard & JSXBase.HTMLAttributes<HTMLAppDashboardElement>;
            "app-editor": LocalJSX.AppEditor & JSXBase.HTMLAttributes<HTMLAppEditorElement>;
            "app-header": LocalJSX.AppHeader & JSXBase.HTMLAttributes<HTMLAppHeaderElement>;
            "app-login": LocalJSX.AppLogin & JSXBase.HTMLAttributes<HTMLAppLoginElement>;
            "app-menu": LocalJSX.AppMenu & JSXBase.HTMLAttributes<HTMLAppMenuElement>;
            "app-profile": LocalJSX.AppProfile & JSXBase.HTMLAttributes<HTMLAppProfileElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "enjineer-editor": LocalJSX.EnjineerEditor & JSXBase.HTMLAttributes<HTMLEnjineerEditorElement>;
        }
    }
}
