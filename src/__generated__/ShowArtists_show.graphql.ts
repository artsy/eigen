/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtists_show$ref: unique symbol;
export type ShowArtists_show$ref = typeof _ShowArtists_show$ref;
export type ShowArtists_show = {
    readonly _id: string;
    readonly gravityID: string;
    readonly artists_grouped_by_name: ReadonlyArray<({
        readonly letter: string | null;
        readonly items: ReadonlyArray<({
            readonly sortable_id: string | null;
            readonly href: string | null;
            readonly " $fragmentRefs": ArtistListItem_artist$ref;
        }) | null> | null;
    }) | null> | null;
    readonly " $refType": ShowArtists_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowArtists_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
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
      "name": "artists_grouped_by_name",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistGroup",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "letter",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "items",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": true,
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "ArtistListItem_artist",
              "args": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "sortable_id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'bb1b03ea1dc8f760126cec8d7912d8e5';
export default node;
