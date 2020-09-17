/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkMeta_artwork = {
    readonly title: string | null;
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly medium: string | null;
    readonly category: string | null;
    readonly height: string | null;
    readonly width: string | null;
    readonly depth: string | null;
    readonly metric: string | null;
    readonly " $refType": "MyCollectionArtworkMeta_artwork";
};
export type MyCollectionArtworkMeta_artwork$data = MyCollectionArtworkMeta_artwork;
export type MyCollectionArtworkMeta_artwork$key = {
    readonly " $data"?: MyCollectionArtworkMeta_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkMeta_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkMeta_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
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
      "name": "date",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "category",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "height",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "width",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "depth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "metric",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '833abde6bb92cb38718938862dd77513';
export default node;
