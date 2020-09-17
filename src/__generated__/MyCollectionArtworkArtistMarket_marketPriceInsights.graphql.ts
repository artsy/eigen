/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarket_marketPriceInsights = {
    readonly annualLotsSold: number | null;
    readonly annualValueSoldCents: number | null;
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "annualValueSoldCents",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "sellThroughRate",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "medianSaleToEstimateRatio",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "liquidityRank",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "demandTrend",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'f036b357c3389f156357ccb7ca694cf1';
export default node;
