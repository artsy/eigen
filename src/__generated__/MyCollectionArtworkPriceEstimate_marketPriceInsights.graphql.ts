/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_marketPriceInsights = {
    readonly lowRangeCents: unknown | null;
    readonly midRangeCents: unknown | null;
    readonly highRangeCents: unknown | null;
    readonly artsyQInventory: number | null;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_marketPriceInsights";
};
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$data = MyCollectionArtworkPriceEstimate_marketPriceInsights;
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_marketPriceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lowRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "midRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "highRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artsyQInventory",
      "storageKey": null
    }
  ],
  "type": "MarketPriceInsights",
  "abstractKey": null
};
(node as any).hash = 'c4741bd74a0ecbda63e9ed4d64c6524b';
export default node;
