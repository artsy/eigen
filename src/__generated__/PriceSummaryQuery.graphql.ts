/* tslint:disable */

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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleArtworkId",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "bidAmountMinor",
    "type": "Int!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkId"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "bidAmountMinor",
    "variableName": "bidAmountMinor"
  }
],
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PriceSummaryQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "SaleArtwork",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "calculatedCost",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "CalculatedCost",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "PriceSummary_calculatedCost",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PriceSummaryQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "type": "SaleArtwork",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "calculatedCost",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "CalculatedCost",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "buyersPremium",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Money",
                    "plural": false,
                    "selections": (v3/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "subtotal",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Money",
                    "plural": false,
                    "selections": (v3/*: any*/)
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PriceSummaryQuery",
    "id": "7af9de55f980032273aebd3520659b05",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3128ecf4576bceace268984d3b56f9c4';
export default node;
