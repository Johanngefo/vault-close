const { Plugin, Notice } = require("obsidian");

// ÄNDERE HIER DIE PIN. Genau vier Ziffern verwenden.
const VAULT_PIN = "5678";

// Sperre nach 30 Sekunden ohne Eingabe oder Maus-/Touch-Aktivität.
const INACTIVITY_MS = 30 * 1000;

module.exports = class VaultMaskPlugin extends Plugin {
  async onload() {
    this.locked = false;
    this.timer = null;
    this.overlay = null;

    this.addRibbonIcon("lock", "Vault-Maske sperren", () => this.lockVault());
    this.addCommand({
      id: "lock-vault-mask",
      name: "Vault-Maske jetzt sperren",
      callback: () => this.lockVault(),
    });

    this.activityEvents = [
      "pointerdown", "pointermove", "keydown",
      "touchstart", "wheel", "scroll"
    ];
    this.onActivity = () => {
      if (!this.locked) this.resetInactivityTimer();
    };

    for (const eventName of this.activityEvents) {
      document.addEventListener(eventName, this.onActivity, { passive: true });
    }

    // Beim Start bzw. erneuten Öffnen von Obsidian immer zuerst sperren.
    this.app.workspace.onLayoutReady(() => this.lockVault());
  }

  resetInactivityTimer() {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.lockVault(), INACTIVITY_MS);
  }

  lockVault() {
    if (this.locked) return;
    this.locked = true;
    window.clearTimeout(this.timer);
    this.showLockScreen();
  }

  showLockScreen() {
    if (this.overlay) this.overlay.remove();

    const overlay = document.createElement("div");
    overlay.className = "vault-mask-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Vault gesperrt");

    const panel = document.createElement("div");
    panel.className = "vault-mask-panel";

    const heading = document.createElement("h2");
    heading.textContent = "Vault gesperrt";

    const description = document.createElement("p");
    description.textContent = "PIN eingeben, um deine Notizen wieder anzuzeigen.";

    const form = document.createElement("form");
    form.className = "vault-mask-form";

    const input = document.createElement("input");
    input.type = "password";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.maxLength = 4;
    input.pattern = "[0-9]{4}";
    input.placeholder = "4-stellige PIN";
    input.setAttribute("aria-label", "PIN");
    input.required = true;

    const error = document.createElement("div");
    error.className = "vault-mask-error";
    error.setAttribute("aria-live", "polite");

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Entsperren";
    button.className = "mod-cta";

    form.append(input, button, error);
    panel.append(heading, description, form);
    overlay.append(panel);
    document.body.append(overlay);

    // Escape und Klicks außerhalb entsperren den Vault ausdrücklich nicht.
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.preventDefault();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value === VAULT_PIN) {
        this.unlockVault();
      } else {
        error.textContent = "Falsche PIN. Bitte erneut versuchen.";
        input.value = "";
        input.focus();
      }
    });

    this.overlay = overlay;
    window.setTimeout(() => input.focus(), 50);
  }

  unlockVault() {
    if (!this.locked) return;
    this.locked = false;
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.resetInactivityTimer();
  }

  onunload() {
    window.clearTimeout(this.timer);
    for (const eventName of this.activityEvents || []) {
      document.removeEventListener(eventName, this.onActivity);
    }
    if (this.overlay) this.overlay.remove();
  }
};
