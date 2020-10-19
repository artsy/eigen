/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ae02a5a670c9ee8edaaafbd52d998637 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarketTestsQueryVariables = {};
export type MyCollectionArtworkArtistMarketTestsQueryResponse = {
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistMarket_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkArtistMarketTestsQuery = {
    readonly response: MyCollectionArtworkArtistMarketTestsQueryResponse;
    readonly variables: MyCollectionArtworkArtistMarketTestsQueryVariables;
};



/*
query MyCollectionArtworkArtistMarketTestsQuery {
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkArtistMarket_marketPriceInsights
  }
}

fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
  annualLotsSold
  annualValueSoldCents
  sellThroughRate
  medianSaleToEstimateRatio
  liquidityRank
  demandTrend
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "artistId",
    "value": "some-artist-id"
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "painting"
  }
],
v1 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistMarket_marketPriceInsights"
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
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
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "ae02a5a670c9ee8edaaafbd52d998637",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.annualLotsSold": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "marketPriceInsights.annualValueSoldCents": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "BigInt"
        },
        "marketPriceInsights.demandTrend": (v1/*: any*/),
        "marketPriceInsights.liquidityRank": (v1/*: any*/),
        "marketPriceInsights.medianSaleToEstimateRatio": (v1/*: any*/),
        "marketPriceInsights.sellThroughRate": (v1/*: any*/)
      }
    },
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '346df385d05d02372b0f114f5335bd71';
export default node;
