import {
  Component,
  ComponentInterface,
  Prop,
  State,
  h,
  Build,
} from "@stencil/core";
import Board from "./libs/Board";
import FloatingButton from "./libs/FloatingButton";
import Pen from "./libs/Pen";
import Pointer from "./libs/Pointer";
import { AuthService } from "../../helpers/auth";
import { DatabaseService } from "../../helpers/database";
import debounce from "../../helpers/debounce";

@Component({
  tag: "app-dashboard",
  styleUrl: "app-dashboard.css",
})
export class AppDashboard implements ComponentInterface {
  @Prop() auth: AuthService;
  @Prop() db: DatabaseService;

  @State() session: firebase.default.User;
  @State() colorInputEl: HTMLInputElement;
  @State() lineWidthEl: HTMLInputElement;
  @State() pointer: any = {};
  @State() pen: Pen;
  @State() showBrushSize = true;
  @State() showColor = true;

  componentWillLoad() {
    window.addEventListener(
      "touchmove",
      (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      },
      { passive: false }
    );
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      this.session = this.auth.isLoggedIn();
      // Initialise application
      const board = new Board("board");
      this.pen = new Pen(board.ctx);
      const floatingButton = new FloatingButton();
      floatingButton.onClick = board.clearMemory.bind(board);
      this.pointer.onEmpty = debounce(board.storeMemory.bind(board), 1500);

      // Attach event listener
      var pointerDown = (e) => {
        // Initialise pointer
        this.pointer = new Pointer(e.pointerId);
        this.pointer.set(board.getPointerPos(e));

        // Get function type
        this.pen.setFuncType(e);
        if (this.pen.funcType === this.pen.funcTypes.menu) board.clearMemory();
        else drawOnCanvas(e, this.pointer, this.pen);
      };
      var pointerMove = (e) => {
        if (
          this.pen.funcType &&
          this.pen.funcType.indexOf(this.pen.funcTypes.draw) !== -1
        ) {
          drawOnCanvas(e, this.pointer.get(e.pointerId), this.pen);
        }
      };
      var pointerCancel = (e) => {
        if (!this.pointer?.destruct) return;
        this.pointer.destruct(e.pointerId);
      };
      board.dom.addEventListener("pointerdown", pointerDown);
      board.dom.addEventListener("pointermove", pointerMove);
      board.dom.addEventListener("pointerup", pointerCancel);
      board.dom.addEventListener("pointerleave", pointerCancel);

      // Draw method
      function drawOnCanvas(e, pointerObj, pen) {
        if (pointerObj) {
          pointerObj.set(board.getPointerPos(e));
          pen.setPen(board.ctx, e);

          if (pointerObj.pos0.x < 0) {
            pointerObj.pos0.x = pointerObj.pos1.x - 1;
            pointerObj.pos0.y = pointerObj.pos1.y - 1;
          }
          board.ctx.beginPath();
          board.ctx.moveTo(pointerObj.pos0.x, pointerObj.pos0.y);
          board.ctx.lineTo(pointerObj.pos1.x, pointerObj.pos1.y);
          board.ctx.closePath();
          board.ctx.stroke();

          pointerObj.pos0.x = pointerObj.pos1.x;
          pointerObj.pos0.y = pointerObj.pos1.y;
        }
      }
    }
  }

  render() {
    return [
      <canvas
        touch-action="none"
        id="board"
        width="640"
        height="640"
        style={{
          width: "320px",
          height: "320px",
        }}
      >
        Opps, you cannot play draw N guess with this browser!
      </canvas>,
      <input
        ref={(el) => (this.lineWidthEl = el)}
        type="range"
        name="lineWidth"
        min={0.25}
        max={20}
        value={1}
        step={0.25}
        style={{
          zIndex: "999",
          position: "absolute",
          bottom: "30px",
          right: "80px",
          display: this.showBrushSize ? "block" : "none",
        }}
        onChange={() => {
          if (!this.pen || !this.colorInputEl?.value) return;
          this.pen.lineWidth = parseInt(this.lineWidthEl.value);
        }}
      />,
      <input
        type="color"
        ref={(el) => (this.colorInputEl = el)}
        style={{
          pointerEvents: "all",
          zIndex: "999",
          position: "absolute",
          bottom: "30px",
          right: "30px",
          display: this.showColor ? "block" : "none",
        }}
        value={"#555555"}
        onChange={() => {
          if (!this.pen || !this.colorInputEl?.value) return;
          this.pen.color = this.colorInputEl.value;
        }}
      />,
    ];
  }
}
