/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtistsPreview_show$ref: unique symbol;
export type ShowArtistsPreview_show$ref = typeof _ShowArtistsPreview_show$ref;
export type ShowArtistsPreview_show = {
    readonly _id: string;
    readonly id: string;
    readonly artists: ReadonlyArray<({
        readonly _id: string;
        readonly id: string;
        readonly href: string | null;
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    }) | null> | null;
    readonly artists_without_artworks: ReadonlyArray<({
        readonly _id: string;
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
  "name": "_id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = [
  v0,
  v1,
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
  v2
];
return {
  "kind": "Fragment",
  "name": "ShowArtistsPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": v3
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists_without_artworks",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": v3
    },
    v2
  ]
};
})();
(node as any).hash = '211fd0417d1988d3ea260f0d2fd2300a';
export default node;
