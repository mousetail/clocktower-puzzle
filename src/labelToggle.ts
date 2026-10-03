import { el } from "./dom.ts";
import type { LabelMode } from "./labels.ts";

export class LabelToggle {
  private readonly root: HTMLElement;
  private readonly buttons = new Map<LabelMode, HTMLButtonElement>();
  private readonly onChange: (mode: LabelMode) => void;

  constructor(onChange: (mode: LabelMode) => void) {
    this.onChange = onChange;
    this.root = el("div", "label-toggle");
    this.addOption("Numbers", "number");
    this.addOption("Names", "name");
    this.addOption("Roles", "role");
  }

  get element(): HTMLElement {
    return this.root;
  }

  setMode(mode: LabelMode): void {
    for (const [key, button] of this.buttons) {
      button.classList.toggle("active", key === mode);
    }
  }

  private addOption(label: string, mode: LabelMode): void {
    const button = el("button", "label-option", label);
    button.type = "button";
    button.addEventListener("click", () => {
      this.setMode(mode);
      this.onChange(mode);
    });
    this.buttons.set(mode, button);
    this.root.append(button);
  }
}
