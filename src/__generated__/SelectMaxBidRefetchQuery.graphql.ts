/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c2f45c01152a7a8532639bfbb38c54f9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SelectMaxBidRefetchQueryVariables = {
    saleArtworkNodeID: string;
};
export type SelectMaxBidRefetchQueryResponse = {
    readonly node: {
        readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_sale_artwork">;
    } | null;
};
export type SelectMaxBidRefetchQuery = {
    readonly response: SelectMaxBidRefetchQueryResponse;
    readonly variables: SelectMaxBidRefetchQueryVariables;
};



/*
query SelectMaxBidRefetchQuery(
  $saleArtworkNodeID: ID!
) {
  node(id: $saleArtworkNodeID) {
    __typename
    ...SelectMaxBid_sale_artwork
    id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  id
  increments(useMyMaxBid: true) {
    display
    cents
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "saleArtworkNodeID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkNodeID"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SelectMaxBidRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SelectMaxBid_sale_artwork"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SelectMaxBidRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                "args": [
                  {
                    "kind": "Literal",
                    "name": "useMyMaxBid",
                    "value": true
                  }
                ],
                "concreteType": "BidIncrementsFormatted",
                "kind": "LinkedField",
                "name": "increments",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "display",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cents",
                    "storageKey": null
                  }
                ],
                "storageKey": "increments(useMyMaxBid:true)"
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
    "id": "c2f45c01152a7a8532639bfbb38c54f9",
    "metadata": {},
    "name": "SelectMaxBidRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5fde6ee648a767128dec75be3f1b134c';
export default node;
