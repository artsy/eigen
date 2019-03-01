/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtists_show$ref: unique symbol;
export type ShowArtists_show$ref = typeof _ShowArtists_show$ref;
export type ShowArtists_show = {
    readonly _id: string;
    readonly id: string;
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



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
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
      "name": "id",
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
            },
            v0
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '49bc2a087941cebe598c7ddbbab55362';
export default node;
