/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2ExhibitorRail_show = {
    readonly internalID: string;
    readonly href: string | null;
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly counts: {
        readonly artworks: number | null;
    } | null;
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly href: string | null;
                readonly artistNames: string | null;
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
                    readonly currentBid: {
                        readonly display: string | null;
                    } | null;
                    readonly counts: {
                        readonly bidderPositions: number | null;
                    } | null;
                } | null;
                readonly sale: {
                    readonly isClosed: boolean | null;
                    readonly isAuction: boolean | null;
                    readonly endAt: string | null;
                } | null;
                readonly title: string | null;
                readonly internalID: string;
                readonly slug: string;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Fair2ExhibitorRail_show";
};
export type Fair2ExhibitorRail_show$data = Fair2ExhibitorRail_show;
export type Fair2ExhibitorRail_show$key = {
    readonly " $data"?: Fair2ExhibitorRail_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2ExhibitorRail_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
],
v3 = [
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
  "name": "Fair2ExhibitorRail_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": (v2/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": (v2/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "artworks",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
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
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "artistNames",
                  "args": null,
                  "storageKey": null
                },
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
                      "selections": (v3/*: any*/)
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "highestBid",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "SaleArtworkHighestBid",
                      "plural": false,
                      "selections": (v3/*: any*/)
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "currentBid",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "SaleArtworkCurrentBid",
                      "plural": false,
                      "selections": (v3/*: any*/)
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "counts",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "SaleArtworkCounts",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "bidderPositions",
                          "args": null,
                          "storageKey": null
                        }
                      ]
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
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "endAt",
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
                (v0/*: any*/),
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
(node as any).hash = '0706ce7454c0ec85a52f96e1874c00c7';
export default node;
