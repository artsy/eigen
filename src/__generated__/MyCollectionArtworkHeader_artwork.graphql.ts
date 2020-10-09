/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkHeader_artwork = {
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly title: string | null;
    readonly " $refType": "MyCollectionArtworkHeader_artwork";
};
export type MyCollectionArtworkHeader_artwork$data = MyCollectionArtworkHeader_artwork;
export type MyCollectionArtworkHeader_artwork$key = {
    readonly " $data"?: MyCollectionArtworkHeader_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkHeader_artwork",
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
(node as any).hash = '7f9d528e025064d6e33456b390ef520a';
export default node;
