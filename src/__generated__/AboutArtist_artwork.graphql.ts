/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _AboutArtist_artwork$ref: unique symbol;
export type AboutArtist_artwork$ref = typeof _AboutArtist_artwork$ref;
export type AboutArtist_artwork = {
    readonly artists: ReadonlyArray<{
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    } | null> | null;
    readonly " $refType": AboutArtist_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AboutArtist_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ArtistListItem_artist",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = 'f9869ca94f1488003b6aed98b4997efd';
export default node;
