/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsights_marketPriceInsights = {
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_marketPriceInsights" | "MyCollectionArtworkPriceEstimate_marketPriceInsights" | "MyCollectionArtworkArtistMarket_marketPriceInsights">;
    readonly " $refType": "MyCollectionArtworkInsights_marketPriceInsights";
};
export type MyCollectionArtworkInsights_marketPriceInsights$data = MyCollectionArtworkInsights_marketPriceInsights;
export type MyCollectionArtworkInsights_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkInsights_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_marketPriceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkInsights_marketPriceInsights",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkDemandIndex_marketPriceInsights"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkArtistMarket_marketPriceInsights"
    }
  ],
  "type": "MarketPriceInsights",
  "abstractKey": null
};
(node as any).hash = 'ae5397d98e82221ac490881008efd25c';
export default node;
