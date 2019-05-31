/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkActions_artwork$ref } from "./ArtworkActions_artwork.graphql";
import { ArtworkAvailability_artwork$ref } from "./ArtworkAvailability_artwork.graphql";
import { ArtworkTombstone_artwork$ref } from "./ArtworkTombstone_artwork.graphql";
import { SellerInfo_artwork$ref } from "./SellerInfo_artwork.graphql";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly images: ReadonlyArray<{
        readonly url: string | null;
        readonly width: number | null;
        readonly height: number | null;
        readonly thumbnail: {
            readonly width: number | null;
            readonly height: number | null;
            readonly url: string | null;
        } | null;
    } | null> | null;
    readonly " $fragmentRefs": ArtworkTombstone_artwork$ref & ArtworkActions_artwork$ref & ArtworkAvailability_artwork$ref & SellerInfo_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "width",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "height",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Artwork_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "screenWidth",
      "type": "Int"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "kind": "LinkedField",
          "alias": "thumbnail",
          "name": "resized",
          "storageKey": null,
          "args": [
            {
              "kind": "Variable",
              "name": "width",
              "variableName": "screenWidth"
            }
          ],
          "concreteType": "ResizedImageUrl",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            (v2/*: any*/),
            (v0/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkTombstone_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkActions_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkAvailability_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SellerInfo_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = '54def6702a33f483dedabe0e07de2cf7';
export default node;
