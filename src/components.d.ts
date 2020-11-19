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
    }
    interface AppHeader {
        "pageTitle": string;
    }
    interface AppLogin {
        "auth": AuthService;
        "config": any;
    }
    interface AppProfile {
        "auth": AuthService;
        "db": DatabaseService;
    }
    interface AppRoot {
    }
    interface EnjineerEditor {
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
    }
    interface AppHeader {
        "pageTitle"?: string;
    }
    interface AppLogin {
        "auth"?: AuthService;
        "config"?: any;
    }
    interface AppProfile {
        "auth"?: AuthService;
        "db"?: DatabaseService;
    }
    interface AppRoot {
    }
    interface EnjineerEditor {
    }
    interface IntrinsicElements {
        "app-dashboard": AppDashboard;
        "app-editor": AppEditor;
        "app-header": AppHeader;
        "app-login": AppLogin;
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
            "app-profile": LocalJSX.AppProfile & JSXBase.HTMLAttributes<HTMLAppProfileElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "enjineer-editor": LocalJSX.EnjineerEditor & JSXBase.HTMLAttributes<HTMLEnjineerEditorElement>;
        }
    }
}
