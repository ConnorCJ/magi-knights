/**
 * A Dialog to prompt the user to select from a list of items.
 * @deprecated since mka 1.6, targeted for removal in 2.1
 */
export default class SelectItemsPrompt extends Dialog {
  constructor(items, dialogData={}, options={}) {
    super(dialogData, options);
    this.options.classes = ["mka", "dialog", "select-items-prompt", "sheet"];
    foundry.utils.logCompatibilityWarning(
      "SelectItemsPrompt has been deprecated and will be removed.",
      { since: "MKA 1.6", until: "MKA 2.1" }
    );

    /**
     * Store a reference to the Item documents being used
     * @type {Array<ItemMKA>}
     */
    this.items = items;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Render the item's sheet if its image is clicked
    html.on("click", ".item-image", event => {
      const item = this.items.find(feature => feature.id === event.currentTarget.dataset?.itemId);
      item?.sheet.render(true);
    });
  }

  /**
   * A constructor function which displays the AddItemPrompt app for a given Actor and Item set.
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {Array<ItemMKAA>} items  Items that might be added.
   * @param {object} options
   * @param {string} options.hint  Localized hint to display at the top of the prompt
   * @returns {Promise<string[]>}  list of item ids which the user has selected
   */
  static async create(items, {hint}) {
    // Render the ability usage template
    const html = await renderTemplate("systems/mka/templates/apps/select-items-prompt.hbs", {items, hint});
    return new Promise(resolve => {
      const dlg = new this(items, {
        title: game.i18n.localize("MKA.SelectItemsPromptTitle"),
        content: html,
        buttons: {
          apply: {
            icon: '<i class="fas fa-user-plus"></i>',
            label: game.i18n.localize("MKA.Apply"),
            callback: html => {
              const fd = new FormDataExtended(html[0].querySelector("form")).toObject();
              const selectedIds = Object.keys(fd).filter(itemId => fd[itemId]);
              resolve(selectedIds);
            }
          },
          cancel: {
            icon: '<i class="fas fa-forward"></i>',
            label: game.i18n.localize("MKA.Skip"),
            callback: () => resolve([])
          }
        },
        default: "apply",
        close: () => resolve([])
      });
      dlg.render(true);
    });
  }
}
