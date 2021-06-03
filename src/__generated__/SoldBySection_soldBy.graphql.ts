/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SoldBySection_soldBy = {
    readonly lineItems: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly fulfillments: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly courier: string;
                            readonly trackingId: string | null;
                            readonly estimatedDelivery: string | null;
                        } | null;
                    } | null> | null;
                } | null;
                readonly artwork: {
                    readonly shippingOrigin: string | null;
                    readonly partner: {
                        readonly name: string | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "SoldBySection_soldBy";
};
export type SoldBySection_soldBy$data = SoldBySection_soldBy;
export type SoldBySection_soldBy$key = {
    readonly " $data"?: SoldBySection_soldBy$data;
    readonly " $fragmentRefs": FragmentRefs<"SoldBySection_soldBy">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SoldBySection_soldBy",
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
                              "name": "courier",
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
                              "args": [
                                {
                                  "kind": "Literal",
                                  "name": "format",
                                  "value": "MMM Do, YYYY"
                                }
                              ],
                              "kind": "ScalarField",
                              "name": "estimatedDelivery",
                              "storageKey": "estimatedDelivery(format:\"MMM Do, YYYY\")"
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
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
                      "kind": "ScalarField",
                      "name": "shippingOrigin",
                      "storageKey": null
                    },
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
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = 'fcdc5eee656c52d7dd5a078df71c7e25';
export default node;
