import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { addressType } from "./addressType";
import { officeType } from "./officeType";
import { discountCodeType } from "./discountCodeType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    productType,
    orderType,
    addressType,
    officeType,
    discountCodeType,
  ],
};
