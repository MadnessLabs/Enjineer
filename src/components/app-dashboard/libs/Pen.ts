export default class Pen {
  colors = {
    bg: "#FFFFFF",
  };
  lineWidth = 1;
  type = "mouse";
  lineJoin = "round";
  funcType = null;
  funcTypes = {
    draw: "draw",
    erase: "draw erase",
    menu: "menu",
  };
  color = "#555555";
  opacity = 1;

  constructor(context) {
    context.lineJoin = this.lineJoin;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.globalAlpha = this.opacity;
  }

  set(context, config) {
    context.lineWidth = config.lineWidth;
    context.strokeStyle = config.color;
    context.lineJoin = this.lineJoin;
    context.globalAlpha = this.opacity;
  }

  setFuncType(pointerEvent) {
    if (this.checkMenuKey(pointerEvent)) this.funcType = this.funcTypes.menu;
    else if (this.checkEraseKeys(pointerEvent))
      this.funcType = this.funcTypes.erase;
    else this.funcType = this.funcTypes.draw;
    return this.funcType;
  }

  setPen(context, pointerEvent) {
    switch (this.funcType) {
      case this.funcTypes.erase: {
        this.set(context, {
          color: this.colors.bg,
          lineWidth: 25,
        });
        break;
      }
      case this.funcTypes.draw: {
        this.set(context, {
          color: this.color,
          lineWidth: this.getLineWidth(pointerEvent),
        });
        break;
      }
    }
  }

  release() {
    this.funcType = null;
  }

  getLineWidth(e) {
    switch (e.pointerType) {
      case "touch": {
        if (e.width < 10 && e.height < 10) {
          return ((e.width + e.height) * 2 + 10) * this.lineWidth;
        } else {
          return ((e.width + e.height - 40) / 2) * this.lineWidth;
        }
      }
      case "pen":
        return e.pressure * 8 * this.lineWidth;
      default:
        return (e.pressure ? e.pressure * 8 : 4) * this.lineWidth;
    }
  }

  checkEraseKeys(e) {
    if (e.buttons === 32) return true;
    else if (e.buttons === 1 && e.shiftKey) return true;
    return false;
  }

  checkMenuKey(e) {
    return e.buttons === 1 && e.ctrlKey;
  }
}
