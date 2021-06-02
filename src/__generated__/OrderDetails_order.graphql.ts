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
<<<<<<< HEAD
    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfoSection_artwork" | "ShipsToSection_address" | "OrderDetailsPayment_order">;
=======
    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfoSection_artwork" | "ShipsToSection_address" | "SummarySection_section">;
>>>>>>> 24b2799cbf (Added summary section and tests)
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
      "name": "ArtworkInfoSection_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShipsToSection_address"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
<<<<<<< HEAD
      "name": "OrderDetailsPayment_order"
=======
      "name": "SummarySection_section"
>>>>>>> 24b2799cbf (Added summary section and tests)
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
<<<<<<< HEAD
(node as any).hash = '7ce6f73f592205aaa44c75d9f00d8bbf';
=======
(node as any).hash = '9bf15939535d297fa8ccdad6753af295';
>>>>>>> 24b2799cbf (Added summary section and tests)
export default node;
