export default class Button {
  settings = [
    {
      name: "shape",
      icon: `<svg width="20" height="20" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Shapes</title><path fill="#000000" d='M336 336H32a16 16 0 01-14-23.81l152-272a16 16 0 0127.94 0l152 272A16 16 0 01336 336z'/><path fill="#000000" d='M336 160a161.07 161.07 0 00-32.57 3.32l74.47 133.27A48 48 0 01336 368H183.33A160 160 0 10336 160z'/></svg>`,
      value: "square",
    },
  ];
  data: any;
  api: any;

  static get toolbox() {
    return {
      title: "Button",
      icon:
        '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data, api }) {
    this.data = data;
    this.api = api;
  }

  render() {
    const buttonEl = document.createElement("ion-button");
    buttonEl.innerHTML = `<div contenteditable="true">New Button</div>`;
    return buttonEl;
  }

  renderSettings() {
    const wrapper = document.createElement("div");

    this.settings.forEach((setting) => {
      let button = document.createElement("div");
      button.classList.add("cdx-settings-button");
      button.innerHTML = setting.icon;
      button.addEventListener("click", () => {
        try {
          const buttonEl = this.api.blocks
            .getBlockByIndex(this.api.blocks.getCurrentBlockIndex())
            .holder.querySelector("ion-button");
          buttonEl.shape = buttonEl.shape === "round" ? "square" : "round";
        } catch (err) {
          console.log("Error setting button shape!");
        }
      });

      wrapper.appendChild(button);
    });

    return wrapper;
  }

  save(button) {
    return {
      text: button.innerText,
    };
  }
}
