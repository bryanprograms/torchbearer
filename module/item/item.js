import {cloneInventory, newItemInventory} from "../inventory/inventory.js";
import {itemExtensions} from "./itemExtensions.js";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TorchbearerItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;

    data.computed = data.computed || {};
    data.computed.consumedSlots = itemData.data.slots;
    if(data.capacity) {
      if(this.actor
          && actorData.data.computed
          && actorData.data.computed.inventory
          && actorData.data.computed.inventory[this._id]) {
        data.computed.inventory = actorData.data.computed.inventory[this._id];
      } else {
        data.computed.inventory = newItemInventory(this);
      }
    }
    let itemExtension = itemExtensions[this.data.name];
    if(itemExtension) {
      for(const functionName in itemExtension) {
        if(itemExtension.hasOwnProperty(functionName)) {
          this[functionName] = itemExtension[functionName].bind(this);
        }
      }
    }
  }

  isCompatibleContainer(containerType) {
    return this.validContainerTypes().includes(containerType);
  }

  validContainerTypes() {
    return [
      this.data.data.equipOptions.option1.value,
      this.data.data.equipOptions.option2.value,
      this.data.data.equipOptions.option3.value,
    ];
  }

  slotsTaken(containerType) {
    for(let i = 1; i <= 3; i++) {
      if(this.data.data.equipOptions['option' + i].value === containerType) {
        return this.data.data.slotOptions['option' + i].value;
      }
    }
    throw("Invalid slots");
  }

  /**
   * Overridable Callback action
   * @param container: the inventory container being added to
   * @param validated: array of items that have already been confirmed
   * @return true if ok to add, false if should be put on ground
   */
  onAfterAddToInventory(container, validated) {
    return true;
  }
}
