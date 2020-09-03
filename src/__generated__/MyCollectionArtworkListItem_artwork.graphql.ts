/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkListItem_artwork = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly artistNames: string | null;
    readonly medium: string | null;
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



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkListItem_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
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
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "medium",
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
(node as any).hash = 'c31d382360718bb4be47c0bc5242b70f';
export default node;
