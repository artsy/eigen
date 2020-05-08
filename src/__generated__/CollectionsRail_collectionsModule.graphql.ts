/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionsRail_collectionsModule = {
    readonly results: ReadonlyArray<{
        readonly title: string;
        readonly slug: string;
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null>;
    readonly " $refType": "CollectionsRail_collectionsModule";
};
export type CollectionsRail_collectionsModule$data = CollectionsRail_collectionsModule;
export type CollectionsRail_collectionsModule$key = {
    readonly " $data"?: CollectionsRail_collectionsModule$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionsRail_collectionsModule">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionsRail_collectionsModule",
  "type": "HomePageMarketingCollectionsModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "MarketingCollection",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
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
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:3)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FilterArtworksEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
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
};
(node as any).hash = '947dc848bc08a0fc254e02a6497461a1';
export default node;
