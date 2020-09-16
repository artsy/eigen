/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndex_marketPriceInsights = {
    readonly annualLotsSold: number | null;
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
      "name": "annualLotsSold",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'd14245e5618c2c24534d1b9ef74019ac';
export default node;
