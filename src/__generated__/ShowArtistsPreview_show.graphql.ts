/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtistsPreview_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly artists: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly href: string | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    } | null> | null;
    readonly artists_without_artworks: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly href: string | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    } | null> | null;
    readonly " $refType": "ShowArtistsPreview_show";
};
export type ShowArtistsPreview_show$data = ShowArtistsPreview_show;
export type ShowArtistsPreview_show$key = {
    readonly " $data"?: ShowArtistsPreview_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowArtistsPreview_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  (v0/*: any*/),
  (v1/*: any*/),
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowArtistsPreview_show",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": "artists_without_artworks",
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artistsWithoutArtworks",
      "plural": true,
      "selections": (v2/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '8d58d64a33c21a4615c45ad7df960299';
export default node;
