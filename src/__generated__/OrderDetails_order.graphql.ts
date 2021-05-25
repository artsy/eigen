/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type OrderDetails_order = {
    readonly internalID: string;
    readonly code: string;
    readonly state: CommerceOrderStateEnum;
    readonly " $refType": "OrderDetails_order";
};
export type OrderDetails_order$data = OrderDetails_order;
export type OrderDetails_order$key = {
    readonly " $data"?: OrderDetails_order$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderDetails_order">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderDetails_order",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "code",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = '1799a310d59e56a3729dcbea215f0a40';
export default node;
