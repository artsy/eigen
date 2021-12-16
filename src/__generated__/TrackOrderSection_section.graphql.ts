/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type TrackOrderSection_section = {
    readonly state: CommerceOrderStateEnum;
    readonly lineItems: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly shipment: {
                    readonly status: string | null;
                    readonly trackingUrl: string | null;
                    readonly trackingNumber: string | null;
                    readonly deliveryStart: string | null;
                    readonly deliveryEnd: string | null;
                    readonly estimatedDeliveryWindow: string | null;
                } | null;
                readonly fulfillments: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly createdAt: string;
                            readonly trackingId: string | null;
                            readonly estimatedDelivery: string | null;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "TrackOrderSection_section";
};
export type TrackOrderSection_section$data = TrackOrderSection_section;
export type TrackOrderSection_section$key = {
    readonly " $data"?: TrackOrderSection_section$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"TrackOrderSection_section">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrackOrderSection_section",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
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
                  "concreteType": "CommerceShipment",
                  "kind": "LinkedField",
                  "name": "shipment",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "status",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "trackingUrl",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "trackingNumber",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "deliveryStart",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "deliveryEnd",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "estimatedDeliveryWindow",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": (v0/*: any*/),
                  "concreteType": "CommerceFulfillmentConnection",
                  "kind": "LinkedField",
                  "name": "fulfillments",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CommerceFulfillmentEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "CommerceFulfillment",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
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
                              "name": "trackingId",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "estimatedDelivery",
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "fulfillments(first:1)"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "lineItems(first:1)"
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
})();
(node as any).hash = '34b7810a7f523fdbbfb4071c7a2366fd';
export default node;
