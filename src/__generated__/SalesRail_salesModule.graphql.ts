/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SalesRail_salesModule = {
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly href: string | null;
        readonly name: string | null;
        readonly liveURLIfOpen: string | null;
        readonly liveStartAt: string | null;
        readonly displayTimelyAt: string | null;
        readonly saleArtworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly artwork: {
                        readonly image: {
                            readonly url: string | null;
                        } | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null>;
    readonly " $refType": "SalesRail_salesModule";
};
export type SalesRail_salesModule$data = SalesRail_salesModule;
export type SalesRail_salesModule$key = {
    readonly " $data"?: SalesRail_salesModule$data;
    readonly " $fragmentRefs": FragmentRefs<"SalesRail_salesModule">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SalesRail_salesModule",
  "type": "HomePageSalesModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internalID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "liveURLIfOpen",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "liveStartAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "displayTimelyAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "saleArtworksConnection",
          "storageKey": "saleArtworksConnection(first:3)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
            }
          ],
          "concreteType": "SaleArtworkConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "SaleArtwork",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "artwork",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Artwork",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "image",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "Image",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "url",
                              "args": [
                                {
                                  "kind": "Literal",
                                  "name": "version",
                                  "value": "large"
                                }
                              ],
                              "storageKey": "url(version:\"large\")"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'c32cc7b766f8d60ebd680302a5ee3832';
export default node;
