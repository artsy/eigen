/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { AboutArtist_artwork$ref } from "./AboutArtist_artwork.graphql";
import { AboutWork_artwork$ref } from "./AboutWork_artwork.graphql";
import { ArtworkDetails_artwork$ref } from "./ArtworkDetails_artwork.graphql";
import { ArtworkHeader_artwork$ref } from "./ArtworkHeader_artwork.graphql";
import { ArtworkHistory_artwork$ref } from "./ArtworkHistory_artwork.graphql";
import { CommercialInformation_artwork$ref } from "./CommercialInformation_artwork.graphql";
import { ContextCard_artwork$ref } from "./ContextCard_artwork.graphql";
import { OtherWorks_artwork$ref } from "./OtherWorks_artwork.graphql";
import { PartnerCard_artwork$ref } from "./PartnerCard_artwork.graphql";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly additional_information: string | null;
    readonly description: string | null;
    readonly provenance: string | null;
    readonly exhibition_history: string | null;
    readonly literature: string | null;
    readonly layer: {
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly partner: {
        readonly type: string | null;
        readonly id: string;
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly artist: {
        readonly name: string | null;
        readonly biography_blurb: {
            readonly text: string | null;
        } | null;
        readonly artworks_connection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly sale: {
        readonly isBenefit: boolean | null;
        readonly isGalleryAuction: boolean | null;
    } | null;
    readonly category: string | null;
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
    readonly context: {
        readonly __typename: string;
    } | null;
    readonly shows: ReadonlyArray<{
        readonly id: string;
    } | null> | null;
    readonly " $fragmentRefs": PartnerCard_artwork$ref & AboutWork_artwork$ref & OtherWorks_artwork$ref & AboutArtist_artwork$ref & ArtworkDetails_artwork$ref & ContextCard_artwork$ref & ArtworkHeader_artwork$ref & CommercialInformation_artwork$ref & ArtworkHistory_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 6
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = [
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
        "selections": (v2/*: any*/)
      }
    ]
  }
],
v4 = {
  "kind": "Variable",
  "name": "exclude",
  "variableName": "excludeArtworkIds"
},
v5 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PUBLISHED_AT_DESC"
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "details",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "Artwork_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "excludeArtworkIds",
      "type": "[String]"
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "additional_information",
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
      "alias": null,
      "name": "exhibition_history",
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
      "name": "layer",
      "storageKey": "layer(id:\"main\")",
      "args": [
        {
          "kind": "Literal",
          "name": "id",
          "value": "main"
        }
      ],
      "concreteType": "ArtworkLayer",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:6)",
          "args": [
            (v0/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v3/*: any*/)
        }
      ]
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
        (v1/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": null,
          "args": [
            (v4/*: any*/),
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "for_sale",
              "value": true
            },
            (v5/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v3/*: any*/)
        }
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
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "biography_blurb",
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
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworks_connection",
          "storageKey": null,
          "args": [
            (v4/*: any*/),
            (v0/*: any*/),
            (v5/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v3/*: any*/)
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
      "kind": "LinkedField",
      "alias": null,
      "name": "conditionDescription",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v6/*: any*/)
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
      "selections": (v6/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "certificateOfAuthenticity",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v6/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "framed",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v6/*: any*/)
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
      "alias": null,
      "name": "image_rights",
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
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "shows",
      "storageKey": "shows(size:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1
        }
      ],
      "concreteType": "Show",
      "plural": true,
      "selections": (v2/*: any*/)
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
      "name": "ArtworkHeader_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialInformation_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkHistory_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'f2b11724c5aabc6662ad31ec2d330c80';
export default node;
