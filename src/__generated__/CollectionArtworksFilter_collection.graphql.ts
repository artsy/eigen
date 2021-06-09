/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionArtworksFilter_collection = {
    readonly slug: string;
    readonly id: string;
    readonly " $refType": "CollectionArtworksFilter_collection";
};
export type CollectionArtworksFilter_collection$data = CollectionArtworksFilter_collection;
export type CollectionArtworksFilter_collection$key = {
    readonly " $data"?: CollectionArtworksFilter_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtworksFilter_collection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "input"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionArtworksFilter_collection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "MarketingCollection",
  "abstractKey": null
};
(node as any).hash = '5cd3c3e866c0f5d8b7fc36941deeb8d4';
export default node;
