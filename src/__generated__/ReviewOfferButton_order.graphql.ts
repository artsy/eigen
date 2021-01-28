/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderModeEnum = "BUY" | "OFFER" | "%future added value";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type ReviewOfferButton_order = {
    readonly __typename: string;
    readonly internalID: string;
    readonly code: string;
    readonly state: CommerceOrderStateEnum;
    readonly mode: CommerceOrderModeEnum | null;
    readonly stateReason: string | null;
    readonly stateExpiresAt: string | null;
    readonly myLastOffer?: {
        readonly internalID: string;
        readonly amount: string | null;
        readonly amountCents: number;
        readonly shippingTotal: string | null;
        readonly shippingTotalCents: number | null;
        readonly taxTotal: string | null;
        readonly taxTotalCents: number | null;
    } | null;
    readonly " $refType": "ReviewOfferButton_order";
};
export type ReviewOfferButton_order$data = ReviewOfferButton_order;
export type ReviewOfferButton_order$key = {
    readonly " $data"?: ReviewOfferButton_order$data;
    readonly " $fragmentRefs": FragmentRefs<"ReviewOfferButton_order">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "precision",
    "value": 2
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ReviewOfferButton_order",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    (v0/*: any*/),
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stateReason",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MMM D"
        }
      ],
      "kind": "ScalarField",
      "name": "stateExpiresAt",
      "storageKey": "stateExpiresAt(format:\"MMM D\")"
    },
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceOffer",
          "kind": "LinkedField",
          "name": "myLastOffer",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": (v1/*: any*/),
              "kind": "ScalarField",
              "name": "amount",
              "storageKey": "amount(precision:2)"
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "amountCents",
              "storageKey": null
            },
            {
              "alias": null,
              "args": (v1/*: any*/),
              "kind": "ScalarField",
              "name": "shippingTotal",
              "storageKey": "shippingTotal(precision:2)"
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "shippingTotalCents",
              "storageKey": null
            },
            {
              "alias": null,
              "args": (v1/*: any*/),
              "kind": "ScalarField",
              "name": "taxTotal",
              "storageKey": "taxTotal(precision:2)"
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "taxTotalCents",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "type": "CommerceOfferOrder",
      "abstractKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
})();
(node as any).hash = '3483d303411dd452591ed60341c242c1';
export default node;
