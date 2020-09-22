/* tslint:disable */
/* eslint-disable */
/* @relayHash 828ff7e89d7acf1b5706b232d82c4ba8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDetailMarketInsightsQueryVariables = {
    artistID: string;
    medium: string;
};
export type MyCollectionArtworkDetailMarketInsightsQueryResponse = {
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkDetailMarketInsightsQuery = {
    readonly response: MyCollectionArtworkDetailMarketInsightsQueryResponse;
    readonly variables: MyCollectionArtworkDetailMarketInsightsQueryVariables;
};



/*
query MyCollectionArtworkDetailMarketInsightsQuery(
  $artistID: ID!
  $medium: String!
) {
  marketPriceInsights(artistId: $artistID, medium: $medium) {
    ...MyCollectionArtworkInsights_marketPriceInsights
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

fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
  demandRank
}

fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
  ...MyCollectionArtworkDemandIndex_marketPriceInsights
  ...MyCollectionArtworkPriceEstimate_marketPriceInsights
  ...MyCollectionArtworkArtistMarket_marketPriceInsights
}

fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
  lowRangeCents
  midRangeCents
  highRangeCents
  artsyQInventory
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artistID",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "medium",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "artistId",
    "variableName": "artistID"
  },
  {
    "kind": "Variable",
    "name": "medium",
    "variableName": "medium"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkDetailMarketInsightsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_marketPriceInsights",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkDetailMarketInsightsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "demandRank",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "lowRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "midRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "highRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "artsyQInventory",
            "args": null,
            "storageKey": null
          },
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
    "name": "MyCollectionArtworkDetailMarketInsightsQuery",
    "id": "67f9903483417b370ea2aa74cd67414d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a619884785e1a43e65249a0d10b71325';
export default node;
