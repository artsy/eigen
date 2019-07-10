/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkGridItem_artwork$ref } from "./ArtworkGridItem_artwork.graphql";
declare const _GenericGrid_artworks$ref: unique symbol;
export type GenericGrid_artworks$ref = typeof _GenericGrid_artworks$ref;
export type GenericGrid_artworks = ReadonlyArray<{
    readonly id: string;
    readonly gravityID: string;
    readonly image: {
        readonly aspect_ratio: number;
    } | null;
    readonly " $fragmentRefs": ArtworkGridItem_artwork$ref;
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
      "name": "id",
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
      "name": "ArtworkGridItem_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'a46b6eab545bd57427676174e7e3b520';
export default node;
