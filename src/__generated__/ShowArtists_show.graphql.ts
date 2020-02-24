/* tslint:disable */

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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "artists_grouped_by_name",
      "name": "artistsGroupedByName",
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
              "kind": "ScalarField",
              "alias": "sortable_id",
              "name": "sortableID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "ArtistListItem_artist",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '62430770dd1bfd850da2d9639f102d4b';
export default node;
