/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkMedium_artwork = {
    readonly mediumType: {
        readonly name: string | null;
        readonly longDescription: string | null;
    } | null;
    readonly " $refType": "ArtworkMedium_artwork";
};
export type ArtworkMedium_artwork$data = ArtworkMedium_artwork;
export type ArtworkMedium_artwork$key = {
    readonly " $data"?: ArtworkMedium_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkMedium_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkMedium_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkMedium",
      "kind": "LinkedField",
      "name": "mediumType",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "longDescription",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '82e32beec44b4e58a3cca0e8b957c8ae';
export default node;
