/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsights_marketPriceInsights = {
    readonly annualLotsSold: number | null;
    readonly annualValueSoldCents: unknown | null;
    readonly artistId: string | null;
    readonly artistName: string | null;
    readonly artsyQInventory: number | null;
    readonly createdAt: unknown | null;
    readonly demandRank: number | null;
    readonly demandTrend: number | null;
    readonly highRangeCents: unknown | null;
    readonly largeHighRangeCents: unknown | null;
    readonly largeLowRangeCents: unknown | null;
    readonly largeMidRangeCents: unknown | null;
    readonly liquidityRank: number | null;
    readonly lowRangeCents: unknown | null;
    readonly medianSaleToEstimateRatio: number | null;
    readonly medium: string | null;
    readonly mediumHighRangeCents: unknown | null;
    readonly mediumLowRangeCents: unknown | null;
    readonly mediumMidRangeCents: unknown | null;
    readonly midRangeCents: unknown | null;
    readonly sellThroughRate: number | null;
    readonly smallHighRangeCents: unknown | null;
    readonly smallLowRangeCents: unknown | null;
    readonly smallMidRangeCents: unknown | null;
    readonly updatedAt: unknown | null;
    readonly " $refType": "ArtistInsights_marketPriceInsights";
};
export type ArtistInsights_marketPriceInsights$data = ArtistInsights_marketPriceInsights;
export type ArtistInsights_marketPriceInsights$key = {
    readonly " $data"?: ArtistInsights_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsights_marketPriceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistInsights_marketPriceInsights",
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
      "name": "artistId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artistName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artsyQInventory",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "demandRank",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "demandTrend",
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
      "name": "liquidityRank",
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
      "name": "medianSaleToEstimateRatio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "medium",
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
      "name": "sellThroughRate",
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
      "name": "updatedAt",
      "storageKey": null
    }
  ],
  "type": "MarketPriceInsights",
  "abstractKey": null
};
(node as any).hash = 'e4fd73330c44c015b17732aa60a60e81';
export default node;
