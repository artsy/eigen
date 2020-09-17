/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "MyCollectionArtworkDemandIndex_marketPriceInsights",
  "type": "MarketPriceInsights",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "demandRank",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'a5e8d6ca493537c2b1216a2cb880cfa5';
export default node;
