/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentlySold_targetSupply = {
    readonly microfunnel: ReadonlyArray<{
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly slug: string;
                    readonly internalID: string;
                    readonly href: string | null;
                    readonly artistNames: string | null;
                    readonly image: {
                        readonly imageURL: string | null;
                    } | null;
                    readonly realizedPrice: string | null;
                } | null;
            } | null> | null;
        } | null;
    } | null> | null;
    readonly " $refType": "RecentlySold_targetSupply";
};
export type RecentlySold_targetSupply$data = RecentlySold_targetSupply;
export type RecentlySold_targetSupply$key = {
    readonly " $data"?: RecentlySold_targetSupply$data;
    readonly " $fragmentRefs": FragmentRefs<"RecentlySold_targetSupply">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecentlySold_targetSupply",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetSupplyMicrofunnelItem",
      "kind": "LinkedField",
      "name": "microfunnel",
      "plural": true,
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
          "concreteType": "ArtworkConnection",
          "kind": "LinkedField",
          "name": "artworksConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ArtworkEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "slug",
                      "storageKey": null
                    },
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
                      "name": "href",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "artistNames",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "image",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "imageURL",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "realizedPrice",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "artworksConnection(first:1)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TargetSupply",
  "abstractKey": null
};
(node as any).hash = '0081c7b83e49f58a5ebfdc039ea1dcb8';
export default node;
