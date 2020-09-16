/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndex_artwork = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkDemandIndex_artwork";
};
export type MyCollectionArtworkDemandIndex_artwork$data = MyCollectionArtworkDemandIndex_artwork;
export type MyCollectionArtworkDemandIndex_artwork$key = {
    readonly " $data"?: MyCollectionArtworkDemandIndex_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkDemandIndex_artwork",
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
    }
  ]
};
(node as any).hash = 'e763226c0a88f8ac35c5f3fa5042fe59';
export default node;
