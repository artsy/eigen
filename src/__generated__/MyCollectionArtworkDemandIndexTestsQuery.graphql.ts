/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0c091bcca9188d6ad138bd745ced6aea */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndexTestsQueryVariables = {};
export type MyCollectionArtworkDemandIndexTestsQueryResponse = {
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkDemandIndexTestsQuery = {
    readonly response: MyCollectionArtworkDemandIndexTestsQueryResponse;
    readonly variables: MyCollectionArtworkDemandIndexTestsQueryVariables;
};



/*
query MyCollectionArtworkDemandIndexTestsQuery {
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkDemandIndex_marketPriceInsights
  }
}

fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
  demandRank
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "MyCollectionArtworkDemandIndex_marketPriceInsights"
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
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "demandRank",
            "storageKey": null
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "0c091bcca9188d6ad138bd745ced6aea",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.demandRank": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        }
      }
    },
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f4276f847a2aa54e4b42f593acfd8502';
export default node;
