/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtistsPreview_show$ref: unique symbol;
export type ShowArtistsPreview_show$ref = typeof _ShowArtistsPreview_show$ref;
export type ShowArtistsPreview_show = {
    readonly artists: ReadonlyArray<({
        readonly id: string;
        readonly href: string | null;
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    }) | null> | null;
    readonly " $refType": ShowArtistsPreview_show$ref;
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
  "name": "ShowArtistsPreview_show",
  "type": "Show",
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
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
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
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '8f64b8808531de5dbbeb4844a2a15c8a';
export default node;
