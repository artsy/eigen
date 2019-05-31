/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistArtworkGrid_artwork$ref } from "./ArtistArtworkGrid_artwork.graphql";
import { PartnerArtworkGrid_artwork$ref } from "./PartnerArtworkGrid_artwork.graphql";
declare const _ArtworkContextArtist_artwork$ref: unique symbol;
export type ArtworkContextArtist_artwork$ref = typeof _ArtworkContextArtist_artwork$ref;
export type ArtworkContextArtist_artwork = {
    readonly " $fragmentRefs": ArtistArtworkGrid_artwork$ref & PartnerArtworkGrid_artwork$ref;
    readonly " $refType": ArtworkContextArtist_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkContextArtist_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ArtistArtworkGrid_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "PartnerArtworkGrid_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'de272f20914b212753e9f70912887b7a';
export default node;
