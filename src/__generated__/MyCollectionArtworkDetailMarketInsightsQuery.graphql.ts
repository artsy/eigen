/* tslint:disable */
/* eslint-disable */
/* @relayHash 73fe74fbb874c87e47455cf80bcc0414 */

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
  annualLotsSold
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
            "name": "annualLotsSold",
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
    "id": "d22cceb87f33967031a8caa8529fb093",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a619884785e1a43e65249a0d10b71325';
export default node;
