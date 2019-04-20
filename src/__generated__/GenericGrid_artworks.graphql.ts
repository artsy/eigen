/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Artwork_artwork$ref } from "./Artwork_artwork.graphql";
declare const _GenericGrid_artworks$ref: unique symbol;
export type GenericGrid_artworks$ref = typeof _GenericGrid_artworks$ref;
export type GenericGrid_artworks = ReadonlyArray<{
    readonly __id: string;
    readonly gravityID: string;
    readonly image: ({
        readonly aspect_ratio: number;
    }) | null;
    readonly " $fragmentRefs": Artwork_artwork$ref;
    readonly " $refType": GenericGrid_artworks$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "GenericGrid_artworks",
  "type": "Artwork",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
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
          "name": "aspect_ratio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Artwork_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '8f857a11baf60285d1a878a7c75bfd02';
export default node;
