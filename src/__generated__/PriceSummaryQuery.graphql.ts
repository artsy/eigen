/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7af9de55f980032273aebd3520659b05 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PriceSummaryQueryVariables = {
    saleArtworkId: string;
    bidAmountMinor: number;
};
export type PriceSummaryQueryResponse = {
    readonly node: {
        readonly calculatedCost?: {
            readonly " $fragmentRefs": FragmentRefs<"PriceSummary_calculatedCost">;
        } | null;
    } | null;
};
export type PriceSummaryQuery = {
    readonly response: PriceSummaryQueryResponse;
    readonly variables: PriceSummaryQueryVariables;
};



/*
query PriceSummaryQuery(
  $saleArtworkId: ID!
  $bidAmountMinor: Int!
) {
  node(id: $saleArtworkId) {
    __typename
    ... on SaleArtwork {
      calculatedCost(bidAmountMinor: $bidAmountMinor) {
        ...PriceSummary_calculatedCost
      }
    }
    id
  }
}

fragment PriceSummary_calculatedCost on CalculatedCost {
  buyersPremium {
    display
  }
  subtotal {
    display
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "bidAmountMinor"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "saleArtworkId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkId"
  }
],
v3 = [
  {
    "kind": "Variable",
    "name": "bidAmountMinor",
    "variableName": "bidAmountMinor"
  }
],
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PriceSummaryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "CalculatedCost",
                "kind": "LinkedField",
                "name": "calculatedCost",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PriceSummary_calculatedCost"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "SaleArtwork",
            "abstractKey": null
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PriceSummaryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "CalculatedCost",
                "kind": "LinkedField",
                "name": "calculatedCost",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Money",
                    "kind": "LinkedField",
                    "name": "buyersPremium",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Money",
                    "kind": "LinkedField",
                    "name": "subtotal",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "SaleArtwork",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7af9de55f980032273aebd3520659b05",
    "metadata": {},
    "name": "PriceSummaryQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3128ecf4576bceace268984d3b56f9c4';
export default node;
