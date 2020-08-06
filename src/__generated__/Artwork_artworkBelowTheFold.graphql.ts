/* tslint:disable */
/* eslint-disable */

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
                readonly artworksConnection: {
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "details",
    "args": null,
    "storageKey": null
  }
],
v2 = [
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
          (v0/*: any*/)
        ]
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "Artwork_artworkBelowTheFold",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "additional_information",
      "name": "additionalInformation",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "provenance",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "exhibition_history",
      "name": "exhibitionHistory",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "literature",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "type",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artist",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "biography_blurb",
          "name": "biographyBlurb",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistBlurb",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "text",
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
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isBenefit",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isGalleryAuction",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "category",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "canRequestLotConditionsReport",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "conditionDescription",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "signature",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "signatureInfo",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "certificateOfAuthenticity",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "framed",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "series",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "publisher",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "manufacturer",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "image_rights",
      "name": "imageRights",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "type": "Sale",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isAuction",
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
      "name": "contextGrids",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "artworks",
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:6)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 6
            }
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v2/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artistSeriesConnection",
      "storageKey": "artistSeriesConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtistSeriesConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistSeriesEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ArtistSeries",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
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
                  "selections": (v2/*: any*/)
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "PartnerCard_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "AboutWork_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "OtherWorks_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "AboutArtist_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkDetails_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ContextCard_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkHistory_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworksInSeriesRail_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = '3a6548470cdd6c57bfac174808f9803d';
export default node;
