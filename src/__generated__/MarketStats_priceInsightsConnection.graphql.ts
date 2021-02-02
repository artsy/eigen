/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketStats_priceInsightsConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly medium: string | null;
            readonly annualLotsSold: number | null;
            readonly annualValueSoldCents: unknown | null;
            readonly sellThroughRate: number | null;
            readonly medianSaleOverEstimatePercentage: number | null;
        } | null;
    } | null> | null;
    readonly " $refType": "MarketStats_priceInsightsConnection";
};
export type MarketStats_priceInsightsConnection$data = MarketStats_priceInsightsConnection;
export type MarketStats_priceInsightsConnection$key = {
    readonly " $data"?: MarketStats_priceInsightsConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"MarketStats_priceInsightsConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MarketStats_priceInsightsConnection",
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
(node as any).hash = '9e1f547f87d91ca18d49af81b3c8d5d7';
export default node;
