/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndex_marketPriceInsights = {
    readonly demandRank: number | null;
    readonly " $refType": "MyCollectionArtworkDemandIndex_marketPriceInsights";
};
export type MyCollectionArtworkDemandIndex_marketPriceInsights$data = MyCollectionArtworkDemandIndex_marketPriceInsights;
export type MyCollectionArtworkDemandIndex_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkDemandIndex_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_marketPriceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkDemandIndex_marketPriceInsights",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "demandRank",
      "storageKey": null
    }
  ],
  "type": "MarketPriceInsights",
  "abstractKey": null
};
(node as any).hash = 'a5e8d6ca493537c2b1216a2cb880cfa5';
export default node;
