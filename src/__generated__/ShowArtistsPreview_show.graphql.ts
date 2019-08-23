/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
declare const _ShowArtistsPreview_show$ref: unique symbol;
export type ShowArtistsPreview_show$ref = typeof _ShowArtistsPreview_show$ref;
export type ShowArtistsPreview_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly artists: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly href: string | null;
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    } | null> | null;
    readonly artists_without_artworks: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly href: string | null;
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    } | null> | null;
    readonly " $refType": ShowArtistsPreview_show$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
  (v0/*: any*/),
  (v1/*: any*/),
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
];
return {
  "kind": "Fragment",
  "name": "ShowArtistsPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": (v2/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": "artists_without_artworks",
      "name": "artistsWithoutArtworks",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": (v2/*: any*/)
    }
  ]
};
})();
(node as any).hash = '8d58d64a33c21a4615c45ad7df960299';
export default node;
