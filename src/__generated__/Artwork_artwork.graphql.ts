/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { AboutArtist_artwork$ref } from "./AboutArtist_artwork.graphql";
import { AboutWork_artwork$ref } from "./AboutWork_artwork.graphql";
import { ArtworkDetails_artwork$ref } from "./ArtworkDetails_artwork.graphql";
import { ArtworkHeader_artwork$ref } from "./ArtworkHeader_artwork.graphql";
import { CommercialInformation_artwork$ref } from "./CommercialInformation_artwork.graphql";
import { OtherWorks_artwork$ref } from "./OtherWorks_artwork.graphql";
import { PartnerCard_artwork$ref } from "./PartnerCard_artwork.graphql";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly additional_information: string | null;
    readonly description: string | null;
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
    readonly " $fragmentRefs": PartnerCard_artwork$ref & AboutWork_artwork$ref & OtherWorks_artwork$ref & AboutArtist_artwork$ref & ArtworkDetails_artwork$ref & ArtworkHeader_artwork$ref & CommercialInformation_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 8
},
v1 = [
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
],
v2 = {
  "kind": "Variable",
  "name": "exclude",
  "variableName": "excludeArtworkIds"
},
v3 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PUBLISHED_AT_DESC"
};
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
          "storageKey": "artworksConnection(first:8)",
          "args": [
            (v0/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v1/*: any*/)
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
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": null,
          "args": [
            (v2/*: any*/),
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "for_sale",
              "value": true
            },
            (v3/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v1/*: any*/)
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
            (v2/*: any*/),
            (v0/*: any*/),
            (v3/*: any*/)
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": (v1/*: any*/)
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
      "name": "ArtworkHeader_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialInformation_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'a759d1970a4793217ff76557d9669430';
export default node;
