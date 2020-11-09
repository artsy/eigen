/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkHeader2_artwork = {
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly title: string | null;
    readonly " $refType": "MyCollectionArtworkHeader2_artwork";
};
export type MyCollectionArtworkHeader2_artwork$data = MyCollectionArtworkHeader2_artwork;
export type MyCollectionArtworkHeader2_artwork$key = {
    readonly " $data"?: MyCollectionArtworkHeader2_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader2_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkHeader2_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artistNames",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'e083571a1ccedac209b78d0ba46cfb4e';
export default node;
