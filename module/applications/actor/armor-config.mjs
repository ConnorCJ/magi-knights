/**
 * Interface for managing a character's armor calculation.
 */
export default class ActorArmorConfig extends DocumentSheet {
  constructor(...args) {
    super(...args);

    /**
     * Cloned copy of the actor for previewing change.s
     * @type {ActorMKA}
     */
    this.clone = this.object.clone();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "actor-armor-config",
      classes: ["mka", "actor-armor-config"],
      template: "systems/mka/templates/apps/actor-armor.hbs",
      width: 320,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("MKA.ArmorConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData() {
    const ac = this.clone.system.attributes.ac;

    // Get configuration data for the calculation mode, reset to flat if configuration is unavailable
    let cfg = CONFIG.MKA.armorClasses[ac.calc];
    if ( !cfg ) {
      ac.calc = "flat";
      cfg = CONFIG.MKA.armorClasses.flat;
      this.clone.updateSource({ "system.attributes.ac.calc": "flat" });
    }

    return {
      ac,
      calculations: CONFIG.MKA.armorClasses,
      valueDisabled: !["flat", "natural"].includes(ac.calc),
      formula: ac.calc === "custom" ? ac.formula : cfg.formula,
      formulaDisabled: ac.calc !== "custom"
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {
    const ac = foundry.utils.expandObject(formData).ac;
    return this.object.update({"system.attributes.ac": ac});
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onChangeInput(event) {
    await super._onChangeInput(event);

    // Update clone with new data & re-render
    this.clone.updateSource({ [`system.attributes.${event.currentTarget.name}`]: event.currentTarget.value });
    this.render();
  }
}
