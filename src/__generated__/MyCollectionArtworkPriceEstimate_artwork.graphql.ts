/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_artwork = {
    readonly costCurrencyCode: string | null;
    readonly costMinor: number | null;
    readonly sizeBucket: string | null;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_artwork";
};
export type MyCollectionArtworkPriceEstimate_artwork$data = MyCollectionArtworkPriceEstimate_artwork;
export type MyCollectionArtworkPriceEstimate_artwork$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkPriceEstimate_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "costCurrencyCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "costMinor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sizeBucket",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'ed3863356afb703062edcc03183f51f0';
export default node;
