/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c9d50c61559ce7b240dc4433a2563a2f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketStatsQueryVariables = {
    artistInternalID: string;
};
export type MarketStatsQueryResponse = {
    readonly priceInsightsConnection: {
        readonly " $fragmentRefs": FragmentRefs<"MarketStats_priceInsightsConnection">;
    } | null;
};
export type MarketStatsQuery = {
    readonly response: MarketStatsQueryResponse;
    readonly variables: MarketStatsQueryVariables;
};



/*
query MarketStatsQuery(
  $artistInternalID: ID!
) {
  priceInsightsConnection: priceInsights(artistId: $artistInternalID, sort: DEMAND_RANK_DESC) {
    ...MarketStats_priceInsightsConnection
  }
}

fragment MarketStats_priceInsightsConnection on PriceInsightConnection {
  edges {
    node {
      medium
      annualLotsSold
      annualValueSoldCents
      sellThroughRate
      medianSaleOverEstimatePercentage
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistInternalID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "artistId",
    "variableName": "artistInternalID"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DEMAND_RANK_DESC"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MarketStatsQuery",
    "selections": [
      {
        "alias": "priceInsightsConnection",
        "args": (v1/*: any*/),
        "concreteType": "PriceInsightConnection",
        "kind": "LinkedField",
        "name": "priceInsights",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MarketStats_priceInsightsConnection"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MarketStatsQuery",
    "selections": [
      {
        "alias": "priceInsightsConnection",
        "args": (v1/*: any*/),
        "concreteType": "PriceInsightConnection",
        "kind": "LinkedField",
        "name": "priceInsights",
        "plural": false,
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "c9d50c61559ce7b240dc4433a2563a2f",
    "metadata": {},
    "name": "MarketStatsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9d5ded2803382428ef7cb7ca0e062037';
export default node;
