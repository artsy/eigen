/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AboutArtist_artwork = {
    readonly artists: ReadonlyArray<{
        readonly id: string;
        readonly biography_blurb: {
            readonly text: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    } | null> | null;
    readonly " $refType": "AboutArtist_artwork";
};
export type AboutArtist_artwork$data = AboutArtist_artwork;
export type AboutArtist_artwork$key = {
    readonly " $data"?: AboutArtist_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"AboutArtist_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AboutArtist_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": "biography_blurb",
          "args": null,
          "concreteType": "ArtistBlurb",
          "kind": "LinkedField",
          "name": "biographyBlurb",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "text",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistListItem_artist"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '7192b5741db2f031a7916f7289488406';
export default node;
