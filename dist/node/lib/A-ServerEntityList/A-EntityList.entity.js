'use strict';

var aConcept = require('@adaas/a-concept');

class A_ServerEntityList extends aConcept.A_Entity {
  constructor() {
    super(...arguments);
    this._items = [];
    this._pagination = {
      total: 0,
      page: 1,
      pageSize: 10
    };
  }
  static get scope() {
    return "a-server";
  }
  /**
   * Returns the entity constructor used for the list
   */
  get entityConstructor() {
    return this._entityConstructor;
  }
  /**
   * Returns the list of items contained in the entity list
   */
  get items() {
    return this._items;
  }
  /**
   * Returns pagination information about the entity list
   */
  get pagination() {
    return this._pagination;
  }
  /**
   * Creates a new instance of A_EntityList
   * 
   * @param newEntity 
   */
  fromNew(newEntity) {
    this.aseid = new aConcept.ASEID({
      concept: aConcept.A_Context.root.name,
      scope: "default",
      entity: "a-list" + (newEntity.name ? `.${newEntity.name}` : ""),
      id: (/* @__PURE__ */ new Date()).getTime().toString()
    });
    this._entityConstructor = newEntity.constructor;
  }
  /**
   * Allows to convert Repository Response data to EntityList instance
   * 
   * [!] This method does not load the data from the repository, it only converts the data to the EntityList instance
   * 
   * @param items 
   * @param pagination 
   */
  fromList(items, pagination) {
    this._items = items.map((item) => {
      if (item instanceof aConcept.A_Entity) {
        return item;
      } else {
        const entity = new this._entityConstructor(item);
        return entity;
      }
    });
    if (pagination) {
      this._pagination = {
        total: pagination.total,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
    }
  }
  /**
   * Serializes the EntityList to a JSON object
   * 
   * @returns 
   */
  toJSON() {
    return {
      ...super.toJSON(),
      items: this._items.map((i) => i.toJSON()),
      pagination: this._pagination
    };
  }
}

exports.A_ServerEntityList = A_ServerEntityList;
//# sourceMappingURL=A-EntityList.entity.js.map
//# sourceMappingURL=A-EntityList.entity.js.map