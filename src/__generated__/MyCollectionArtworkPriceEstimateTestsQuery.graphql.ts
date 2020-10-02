/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 746c594850d73eebbe2a9bc39c815d44 */

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
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "BigInt"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
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
            "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights"
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
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
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
            "name": "lowRangeCents",
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
            "name": "highRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "artsyQInventory",
            "storageKey": null
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "746c594850d73eebbe2a9bc39c815d44",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.artsyQInventory": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "marketPriceInsights.highRangeCents": (v1/*: any*/),
        "marketPriceInsights.lowRangeCents": (v1/*: any*/),
        "marketPriceInsights.midRangeCents": (v1/*: any*/)
      }
    },
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'a3bff129015de8fe1d80cd87f423b736';
export default node;
