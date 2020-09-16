/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_artwork = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_artwork";
};
export type MyCollectionArtworkPriceEstimate_artwork$data = MyCollectionArtworkPriceEstimate_artwork;
export type MyCollectionArtworkPriceEstimate_artwork$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkPriceEstimate_artwork",
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
(node as any).hash = 'c343154b7e8812726f6f372709ff4c50';
export default node;
