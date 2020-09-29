/* tslint:disable */
/* eslint-disable */
/* @relayHash 991127ba41f2405c3e9117dbf4e71282 */

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
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistMarket_marketPriceInsights",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
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
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkArtistMarketTestsQuery",
    "id": "ae02a5a670c9ee8edaaafbd52d998637",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "type": "MarketPriceInsights",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.annualLotsSold": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.annualValueSoldCents": {
          "type": "BigInt",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.sellThroughRate": (v1/*: any*/),
        "marketPriceInsights.medianSaleToEstimateRatio": (v1/*: any*/),
        "marketPriceInsights.liquidityRank": (v1/*: any*/),
        "marketPriceInsights.demandTrend": (v1/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '346df385d05d02372b0f114f5335bd71';
export default node;
