/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarket_marketPriceInsights = {
    readonly annualLotsSold: number | null;
    readonly " $refType": "MyCollectionArtworkArtistMarket_marketPriceInsights";
};
export type MyCollectionArtworkArtistMarket_marketPriceInsights$data = MyCollectionArtworkArtistMarket_marketPriceInsights;
export type MyCollectionArtworkArtistMarket_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkArtistMarket_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistMarket_marketPriceInsights">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistMarket_marketPriceInsights",
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
(node as any).hash = 'eb54c6f0fc393d286493f4c6fdf3e766';
export default node;
