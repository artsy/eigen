/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type OrderDetails_order = {
    readonly lineItems: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly artwork: {
                    readonly partner: {
                        readonly name: string | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly createdAt: string;
    readonly state: CommerceOrderStateEnum;
    readonly requestedFulfillment: ({
        readonly __typename: "CommerceShip";
    } | {
        readonly __typename: "CommercePickup";
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly code: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfoSection_artwork" | "SummarySection_section" | "OrderDetailsPayment_order" | "ShipsToSection_address" | "SoldBySection_soldBy">;
    readonly " $refType": "OrderDetails_order";
};
export type OrderDetails_order$data = OrderDetails_order;
export type OrderDetails_order$key = {
    readonly " $data"?: OrderDetails_order$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderDetails_order">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderDetails_order",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "CommerceLineItemConnection",
      "kind": "LinkedField",
      "name": "lineItems",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceLineItemEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CommerceLineItem",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "kind": "LinkedField",
                  "name": "artwork",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Partner",
                      "kind": "LinkedField",
                      "name": "partner",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "name",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "lineItems(first:1)"
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
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
      "concreteType": null,
      "kind": "LinkedField",
      "name": "requestedFulfillment",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "CommerceShip",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "CommercePickup",
          "abstractKey": null
        }
      ],
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkInfoSection_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SummarySection_section"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrderDetailsPayment_order"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShipsToSection_address"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SoldBySection_soldBy"
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
})();
(node as any).hash = 'a82b83c51656e4c08b43c53aa8b09d6b';
export default node;
