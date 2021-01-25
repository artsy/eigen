/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketStats_priceInsights = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly medium: string | null;
            readonly annualLotsSold: number | null;
            readonly annualValueSoldCents: unknown | null;
            readonly sellThroughRate: number | null;
            readonly medianSaleOverEstimatePercentage: number | null;
        } | null;
    } | null> | null;
    readonly " $refType": "MarketStats_priceInsights";
};
export type MarketStats_priceInsights$data = MarketStats_priceInsights;
export type MarketStats_priceInsights$key = {
    readonly " $data"?: MarketStats_priceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MarketStats_priceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MarketStats_priceInsights",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PriceInsightEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MarketPriceInsights",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
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
              "name": "medianSaleOverEstimatePercentage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "PriceInsightConnection",
  "abstractKey": null
};
(node as any).hash = 'd7e02768653426e9cea4eda723021283';
export default node;
