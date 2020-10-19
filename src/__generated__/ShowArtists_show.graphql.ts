/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtists_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly artists_grouped_by_name: ReadonlyArray<{
        readonly letter: string | null;
        readonly items: ReadonlyArray<{
            readonly sortable_id: string | null;
            readonly href: string | null;
            readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
        } | null> | null;
    } | null> | null;
    readonly " $refType": "ShowArtists_show";
};
export type ShowArtists_show$data = ShowArtists_show;
export type ShowArtists_show$key = {
    readonly " $data"?: ShowArtists_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowArtists_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowArtists_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": "artists_grouped_by_name",
      "args": null,
      "concreteType": "ArtistGroup",
      "kind": "LinkedField",
      "name": "artistsGroupedByName",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "letter",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Artist",
          "kind": "LinkedField",
          "name": "items",
          "plural": true,
          "selections": [
            {
              "alias": "sortable_id",
              "args": null,
              "kind": "ScalarField",
              "name": "sortableID",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "href",
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
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '62430770dd1bfd850da2d9639f102d4b';
export default node;
