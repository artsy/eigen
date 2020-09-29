/* tslint:disable */
/* eslint-disable */
/* @relayHash 7fc45a3c4b60907b4026035f2b1da5f9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimateTestsQueryVariables = {};
export type MyCollectionArtworkPriceEstimateTestsQueryResponse = {
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkPriceEstimateTestsQuery = {
    readonly response: MyCollectionArtworkPriceEstimateTestsQueryResponse;
    readonly variables: MyCollectionArtworkPriceEstimateTestsQueryVariables;
};



/*
query MyCollectionArtworkPriceEstimateTestsQuery {
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkPriceEstimate_marketPriceInsights
  }
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
  "type": "BigInt",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
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
            "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
    "id": "746c594850d73eebbe2a9bc39c815d44",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "type": "MarketPriceInsights",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.lowRangeCents": (v1/*: any*/),
        "marketPriceInsights.midRangeCents": (v1/*: any*/),
        "marketPriceInsights.highRangeCents": (v1/*: any*/),
        "marketPriceInsights.artsyQInventory": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": true
        }
      }
    }
  }
};
})();
(node as any).hash = 'a3bff129015de8fe1d80cd87f423b736';
export default node;
