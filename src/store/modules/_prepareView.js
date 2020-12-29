import {entityTypes} from "../../consts";

export const PREPARE_VIEW_HANDLER = {
  [entityTypes.DEFAULT](item) {
    return item;
  },
  [entityTypes.USERS](item) {
    return item
  },
  [entityTypes.CONTRACTS](item) {
    return item
  },
  [entityTypes.ACTIVITIES](item) {
    return item
  }
};
