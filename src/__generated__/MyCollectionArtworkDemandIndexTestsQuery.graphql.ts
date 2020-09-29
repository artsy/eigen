/* tslint:disable */
/* eslint-disable */
/* @relayHash 454a02f7ac3b0eafc045bc789a197526 */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "MyCollectionArtworkDemandIndex_marketPriceInsights",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "demandRank",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
    "id": "0c091bcca9188d6ad138bd745ced6aea",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketPriceInsights": {
          "type": "MarketPriceInsights",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.demandRank": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": true
        }
      }
    }
  }
};
})();
(node as any).hash = 'f4276f847a2aa54e4b42f593acfd8502';
export default node;
