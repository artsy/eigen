/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkContextArtist_artwork$ref } from "./ArtworkContextArtist_artwork.graphql";
declare const _OtherWorks_artwork$ref: unique symbol;
export type OtherWorks_artwork$ref = typeof _OtherWorks_artwork$ref;
export type OtherWorks_artwork = {
    readonly id: string;
    readonly context: {
        readonly __typename: string;
    } | null;
    readonly " $fragmentRefs": ArtworkContextArtist_artwork$ref;
    readonly " $refType": OtherWorks_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "OtherWorks_artwork",
  "type": "Artwork",
  "metadata": null,
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
      "kind": "FragmentSpread",
      "name": "ArtworkContextArtist_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '36e03b7e36a72ce4dc1afb0635369554';
export default node;
