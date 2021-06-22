/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artwork_artworkBelowTheFold = {
    readonly additional_information: string | null;
    readonly description: string | null;
    readonly provenance: string | null;
    readonly exhibition_history: string | null;
    readonly literature: string | null;
    readonly partner: {
        readonly type: string | null;
        readonly id: string;
    } | null;
    readonly artist: {
        readonly biography_blurb: {
            readonly text: string | null;
        } | null;
        readonly artistSeriesConnection: {
            readonly totalCount: number;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMoreSeries_artist">;
    } | null;
    readonly sale: {
        readonly id: string;
        readonly isBenefit: boolean | null;
        readonly isGalleryAuction: boolean | null;
    } | null;
    readonly category: string | null;
    readonly canRequestLotConditionsReport: boolean | null;
    readonly conditionDescription: {
        readonly details: string | null;
    } | null;
    readonly signature: string | null;
    readonly signatureInfo: {
        readonly details: string | null;
    } | null;
    readonly certificateOfAuthenticity: {
        readonly details: string | null;
    } | null;
    readonly framed: {
        readonly details: string | null;
    } | null;
    readonly series: string | null;
    readonly publisher: string | null;
    readonly manufacturer: string | null;
    readonly image_rights: string | null;
    readonly context: ({
        readonly __typename: "Sale";
        readonly isAuction: boolean | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly contextGrids: ReadonlyArray<{
        readonly artworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null> | null;
    readonly artistSeriesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly filterArtworksConnection: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly id: string;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerCard_artwork" | "AboutWork_artwork" | "OtherWorks_artwork" | "AboutArtist_artwork" | "ArtworkDetails_artwork" | "ContextCard_artwork" | "ArtworkHistory_artwork" | "ArtworksInSeriesRail_artwork">;
    readonly " $refType": "Artwork_artworkBelowTheFold";
};
export type Artwork_artworkBelowTheFold$data = Artwork_artworkBelowTheFold;
export type Artwork_artworkBelowTheFold$key = {
    readonly " $data"?: Artwork_artworkBelowTheFold$data;
    readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkBelowTheFold">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "details",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v0/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Artwork_artworkBelowTheFold",
  "selections": [
    {
      "alias": "additional_information",
      "args": null,
      "kind": "ScalarField",
      "name": "additionalInformation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "provenance",
      "storageKey": null
    },
    {
      "alias": "exhibition_history",
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionHistory",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "literature",
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
          "name": "type",
          "storageKey": null
        },
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
        {
          "alias": "biography_blurb",
          "args": null,
          "concreteType": "ArtistBlurb",
          "kind": "LinkedField",
          "name": "biographyBlurb",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "text",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 4
            }
          ],
          "concreteType": "ArtistSeriesConnection",
          "kind": "LinkedField",
          "name": "artistSeriesConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalCount",
              "storageKey": null
            }
          ],
          "storageKey": "artistSeriesConnection(first:4)"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistSeriesMoreSeries_artist"
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isBenefit",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isGalleryAuction",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "canRequestLotConditionsReport",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "kind": "LinkedField",
      "name": "conditionDescription",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "signature",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "kind": "LinkedField",
      "name": "signatureInfo",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "kind": "LinkedField",
      "name": "certificateOfAuthenticity",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "kind": "LinkedField",
      "name": "framed",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "series",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "publisher",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "manufacturer",
      "storageKey": null
    },
    {
      "alias": "image_rights",
      "args": null,
      "kind": "ScalarField",
      "name": "imageRights",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "context",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAuction",
              "storageKey": null
            }
          ],
          "type": "Sale",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "contextGrids",
      "plural": true,
      "selections": [
        {
          "alias": "artworks",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 6
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
              "selections": (v2/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": "artworksConnection(first:6)"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtistSeriesConnection",
      "kind": "LinkedField",
      "name": "artistSeriesConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtistSeriesEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ArtistSeries",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 20
                    },
                    {
                      "kind": "Literal",
                      "name": "input",
                      "value": {
                        "sort": "-decayed_merch"
                      }
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
                      "selections": (v2/*: any*/),
                      "storageKey": null
                    }
                  ],
                  "storageKey": "filterArtworksConnection(first:20,input:{\"sort\":\"-decayed_merch\"})"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "artistSeriesConnection(first:1)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerCard_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AboutWork_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OtherWorks_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AboutArtist_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkDetails_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ContextCard_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkHistory_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworksInSeriesRail_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = '30f25615a303c3c2dde099834bad0a23';
export default node;
