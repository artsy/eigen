/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_marketPriceInsights = {
    readonly highRangeCents: unknown | null;
    readonly largeHighRangeCents: unknown | null;
    readonly largeLowRangeCents: unknown | null;
    readonly largeMidRangeCents: unknown | null;
    readonly lowRangeCents: unknown | null;
    readonly mediumHighRangeCents: unknown | null;
    readonly mediumLowRangeCents: unknown | null;
    readonly mediumMidRangeCents: unknown | null;
    readonly midRangeCents: unknown | null;
    readonly smallHighRangeCents: unknown | null;
    readonly smallLowRangeCents: unknown | null;
    readonly smallMidRangeCents: unknown | null;
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
      "name": "highRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "largeHighRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "largeLowRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "largeMidRangeCents",
      "storageKey": null
    },
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
      "name": "mediumHighRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mediumLowRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mediumMidRangeCents",
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
      "name": "smallHighRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "smallLowRangeCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "smallMidRangeCents",
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
(node as any).hash = 'c5528817f0ed2109eb23e454510a27bd';
export default node;
