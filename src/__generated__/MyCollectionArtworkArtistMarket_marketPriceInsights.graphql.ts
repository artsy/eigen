/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarket_marketPriceInsights = {
    readonly annualLotsSold: number | null;
    readonly annualValueSoldCents: unknown | null;
    readonly sellThroughRate: number | null;
    readonly medianSaleToEstimateRatio: number | null;
    readonly liquidityRank: number | null;
    readonly demandTrend: number | null;
    readonly " $refType": "MyCollectionArtworkArtistMarket_marketPriceInsights";
};
export type MyCollectionArtworkArtistMarket_marketPriceInsights$data = MyCollectionArtworkArtistMarket_marketPriceInsights;
export type MyCollectionArtworkArtistMarket_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkArtistMarket_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistMarket_marketPriceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkArtistMarket_marketPriceInsights",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "annualLotsSold",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "annualValueSoldCents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sellThroughRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "medianSaleToEstimateRatio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liquidityRank",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "demandTrend",
      "storageKey": null
    }
  ],
  "type": "MarketPriceInsights",
  "abstractKey": null
};
(node as any).hash = 'f036b357c3389f156357ccb7ca694cf1';
export default node;
