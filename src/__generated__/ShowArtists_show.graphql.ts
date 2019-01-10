/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtists_show$ref: unique symbol;
export type ShowArtists_show$ref = typeof _ShowArtists_show$ref;
export type ShowArtists_show = {
    readonly artists_grouped_by_name: ReadonlyArray<({
        readonly letter: string | null;
        readonly items: ReadonlyArray<({
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
            v0
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '6c247fcf26a4ecc20c9d60f8bd86933b';
export default node;
