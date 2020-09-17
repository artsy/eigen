/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "MyCollectionArtworkHeader_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "date",
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '7f9d528e025064d6e33456b390ef520a';
export default node;
