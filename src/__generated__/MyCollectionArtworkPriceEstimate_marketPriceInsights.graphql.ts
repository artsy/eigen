/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_marketPriceInsights = {
    readonly lowRangeCents: number | null;
    readonly midRangeCents: number | null;
    readonly highRangeCents: number | null;
    readonly artsyQInventory: number | null;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_marketPriceInsights";
};
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$data = MyCollectionArtworkPriceEstimate_marketPriceInsights;
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_marketPriceInsights">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights",
  "type": "MarketPriceInsights",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lowRangeCents",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "midRangeCents",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "highRangeCents",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artsyQInventory",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'c4741bd74a0ecbda63e9ed4d64c6524b';
export default node;
