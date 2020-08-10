/* tslint:disable */
/* eslint-disable */

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
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ArtistNotableWorksRail_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filterArtworksConnection",
      "storageKey": "filterArtworksConnection(first:10,sort:\"-weighted_iconicity\")",
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
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
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
                      "name": "imageURL",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "aspectRatio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "saleMessage",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "saleArtwork",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "SaleArtwork",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "openingBid",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "SaleArtworkOpeningBid",
                      "plural": false,
                      "selections": (v0/*: any*/)
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "highestBid",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "SaleArtworkHighestBid",
                      "plural": false,
                      "selections": (v0/*: any*/)
                    }
                  ]
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "sale",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Sale",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "isClosed",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "isAuction",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
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
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '169c295998c2442d10e5762e5c40b0c6';
export default node;
