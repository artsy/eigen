/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkListItem_artwork = {
    readonly artist: {
        readonly internalID: string;
    } | null;
    readonly artistNames: string | null;
    readonly id: string;
    readonly internalID: string;
    readonly medium: string | null;
    readonly slug: string;
    readonly title: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "MyCollectionArtworkListItem_artwork";
};
export type MyCollectionArtworkListItem_artwork$data = MyCollectionArtworkListItem_artwork;
export type MyCollectionArtworkListItem_artwork$key = {
    readonly " $data"?: MyCollectionArtworkListItem_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkListItem_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "MyCollectionArtworkListItem_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artist",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
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
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "medium",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '45390ea8fbf34e63784511bf5270a17f';
export default node;
