/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _AboutArtist_artwork$ref: unique symbol;
export type AboutArtist_artwork$ref = typeof _AboutArtist_artwork$ref;
export type AboutArtist_artwork = {
    readonly artist: {
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    } | null;
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
      "name": "artist",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
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
(node as any).hash = 'ef1c337bd0ade2ab9e386293d4383c2f';
export default node;
