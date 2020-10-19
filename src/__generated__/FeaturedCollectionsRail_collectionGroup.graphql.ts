/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedCollectionsRail_collectionGroup = {
    readonly name: string;
    readonly members: ReadonlyArray<{
        readonly slug: string;
        readonly id: string;
        readonly title: string;
        readonly priceGuidance: number | null;
        readonly descriptionMarkdown: string | null;
        readonly featuredCollectionArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    }>;
    readonly " $refType": "FeaturedCollectionsRail_collectionGroup";
};
export type FeaturedCollectionsRail_collectionGroup$data = FeaturedCollectionsRail_collectionGroup;
export type FeaturedCollectionsRail_collectionGroup$key = {
    readonly " $data"?: FeaturedCollectionsRail_collectionGroup$data;
    readonly " $fragmentRefs": FragmentRefs<"FeaturedCollectionsRail_collectionGroup">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeaturedCollectionsRail_collectionGroup",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MarketingCollection",
      "kind": "LinkedField",
      "name": "members",
      "plural": true,
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
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "priceGuidance",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "descriptionMarkdown",
          "storageKey": null
        },
        {
          "alias": "featuredCollectionArtworks",
          "args": [
            {
              "kind": "Literal",
              "name": "aggregations",
              "value": [
                "TOTAL"
              ]
            },
            {
              "kind": "Literal",
              "name": "first",
              "value": 1
            },
            {
              "kind": "Literal",
              "name": "sort",
              "value": "-decayed_merch"
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "kind": "LinkedField",
          "name": "artworksConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FilterArtworksEdge",
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
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "image",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "url",
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
          "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:1,sort:\"-decayed_merch\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MarketingCollectionGroup",
  "abstractKey": null
};
(node as any).hash = 'a9af0951e749e84d2d5f8617ea6f9eb1';
export default node;
