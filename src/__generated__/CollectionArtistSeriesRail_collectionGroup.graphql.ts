/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionArtistSeriesRail_collectionGroup = {
    readonly name: string;
    readonly members: ReadonlyArray<{
        readonly slug: string;
        readonly id: string;
        readonly title: string;
        readonly priceGuidance: number | null;
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly title: string | null;
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    }>;
    readonly " $refType": "CollectionArtistSeriesRail_collectionGroup";
};
export type CollectionArtistSeriesRail_collectionGroup$data = CollectionArtistSeriesRail_collectionGroup;
export type CollectionArtistSeriesRail_collectionGroup$key = {
    readonly " $data"?: CollectionArtistSeriesRail_collectionGroup$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionArtistSeriesRail_collectionGroup",
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "priceGuidance",
          "storageKey": null
        },
        {
          "alias": null,
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
              "value": 3
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
                    (v0/*: any*/),
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
          "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MarketingCollectionGroup",
  "abstractKey": null
};
})();
(node as any).hash = '3b5d0b3f36b2c464bd7f265edc79a781';
export default node;
