/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistNotableWorksRail_artist = {
    readonly filterArtworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly image: {
                    readonly imageURL: string | null;
                    readonly aspectRatio: number;
                } | null;
                readonly saleMessage: string | null;
                readonly saleArtwork: {
                    readonly openingBid: {
                        readonly display: string | null;
                    } | null;
                    readonly highestBid: {
                        readonly display: string | null;
                    } | null;
                } | null;
                readonly sale: {
                    readonly isClosed: boolean | null;
                    readonly isAuction: boolean | null;
                } | null;
                readonly title: string | null;
                readonly internalID: string;
                readonly slug: string;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistNotableWorksRail_artist";
};
export type ArtistNotableWorksRail_artist$data = ArtistNotableWorksRail_artist;
export type ArtistNotableWorksRail_artist$key = {
    readonly " $data"?: ArtistNotableWorksRail_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistNotableWorksRail_artist">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistNotableWorksRail_artist",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "-weighted_iconicity"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "kind": "LinkedField",
      "name": "filterArtworksConnection",
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
                  "kind": "ScalarField",
                  "name": "id",
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
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "aspectRatio",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "saleMessage",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "SaleArtwork",
                  "kind": "LinkedField",
                  "name": "saleArtwork",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "SaleArtworkOpeningBid",
                      "kind": "LinkedField",
                      "name": "openingBid",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "SaleArtworkHighestBid",
                      "kind": "LinkedField",
                      "name": "highestBid",
                      "plural": false,
                      "selections": (v0/*: any*/),
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Sale",
                  "kind": "LinkedField",
                  "name": "sale",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isClosed",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isAuction",
                      "storageKey": null
                    }
                  ],
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
                  "name": "internalID",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "slug",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "filterArtworksConnection(first:10,sort:\"-weighted_iconicity\")"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
})();
(node as any).hash = '169c295998c2442d10e5762e5c40b0c6';
export default node;
