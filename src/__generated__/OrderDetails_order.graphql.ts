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
    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfoSection_order">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkInfoSection_order"
    }
  ],
  "type": "CommerceBuyOrder",
  "abstractKey": null
};
(node as any).hash = 'dbb2bf6b80e853ef02b2ca5104a848f3';
export default node;
