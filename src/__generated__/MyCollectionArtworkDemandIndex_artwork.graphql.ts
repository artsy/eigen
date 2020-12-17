/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndex_artwork = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $refType": "MyCollectionArtworkDemandIndex_artwork";
};
export type MyCollectionArtworkDemandIndex_artwork$data = MyCollectionArtworkDemandIndex_artwork;
export type MyCollectionArtworkDemandIndex_artwork$key = {
    readonly " $data"?: MyCollectionArtworkDemandIndex_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkDemandIndex_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'b8e2dcb63469cb20908c8b600b70637e';
export default node;
