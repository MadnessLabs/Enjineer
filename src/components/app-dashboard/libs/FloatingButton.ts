import throttle from "../../../helpers/throttle";

export default class FloatingButton {
  buttonSize = Math.max(window.innerWidth, window.innerHeight) > 768 ? 80 : 50;
  dom = null;
  dragCount = 0;
  isActive = false;
  clickedId = null;
  config = {
    size: this.buttonSize,
    margin: this.buttonSize * 1.3,
    inactiveOpacity: 0.5,
    activeOpacity: 0.95,
  };

  constructor(elementId?) {
    this.dom = this.constructElement.call(this, elementId);
    this.applyStyle.call(this, {
      width: this.config.size + "px",
      height: this.config.size + "px",
      borderRadius: this.config.size + "px",
      position: "absolute",
      top: this.getOffset(document.body.clientHeight, this.config.margin),
      left: this.getOffset(document.body.clientWidth, this.config.margin),
      opacity: this.config.inactiveOpacity,
    });

    // Apply eventListener
    this.dom.addEventListener("pointerdown", this.buttonClicked.bind(this));
    this.dom.addEventListener("pointerup", this.buttonUnclicked.bind(this));
    document.body.addEventListener(
      "pointermove",
      this.buttonDragged.bind(this)
    );
    window.addEventListener(
      "resize",
      throttle(this.buttonRepositioned.bind(this), 50)
    );
  }

  onClick() {
    return;
  }

  getOffset(offset, margin) {
    return offset - margin + "px";
  }

  constructElement(elementId) {
    var element = document.createElement("div");
    document.body.appendChild(element);
    element.setAttribute("id", elementId || "floatingButton");
    element.setAttribute("touch-action", "none");
    return element;
  }

  applyStyle(cssStyle) {
    var self = this;
    Object.keys(cssStyle).map(function (key) {
      self.dom.style[key] = cssStyle[key];
    });
  }

  buttonClicked(event) {
    this.clickedId = event.pointerId;
    this.isActive = true;
    this.dom.style.opacity = this.config.activeOpacity;
  }

  buttonUnclicked(_event) {
    if (this.clickedId && this.dragCount < 3) {
      if (this.onClick) this.onClick();
    }
    this.clickedId = null;
    this.dragCount = 0;
    this.isActive = false;
    var self = this;
    setTimeout(function () {
      if (!this.isActive) self.dom.style.opacity = self.config.inactiveOpacity;
    }, 1000);
  }

  buttonRepositioned(_event) {
    if (
      parseInt(this.dom.style.top) + this.config.margin >
      window.innerHeight
    ) {
      this.dom.style.top = this.getOffset(
        document.body.clientHeight,
        this.config.margin
      );
    }
    if (
      parseInt(this.dom.style.left) + this.config.margin >
      window.innerWidth
    ) {
      this.dom.style.left = this.getOffset(
        document.body.clientWidth,
        this.config.margin
      );
    }
  }

  buttonDragged(event) {
    if (this.clickedId && this.clickedId === event.pointerId) {
      this.isActive = true;
      this.dragCount += 1;
      this.dom.style.top = event.pageY - this.config.size / 2 + "px";
      this.dom.style.left = event.pageX - this.config.size / 2 + "px";
    }
  }
}
