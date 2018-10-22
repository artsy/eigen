/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ConfirmBidRefetchQueryVariables = {
    readonly saleID: string;
};
export type ConfirmBidRefetchQueryResponse = {
    readonly me: ({
        readonly has_qualified_credit_cards: boolean | null;
        readonly bidders: ReadonlyArray<({
            readonly qualified_for_bidding: boolean | null;
        }) | null> | null;
    }) | null;
};
export type ConfirmBidRefetchQuery = {
    readonly response: ConfirmBidRefetchQueryResponse;
    readonly variables: ConfirmBidRefetchQueryVariables;
};



/*
query ConfirmBidRefetchQuery(
  $saleID: String!
) {
  me {
    has_qualified_credit_cards
    bidders(sale_id: $saleID) {
      qualified_for_bidding
      __id
    }
    __id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "me",
    "storageKey": null,
    "args": null,
    "concreteType": "Me",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "has_qualified_credit_cards",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "bidders",
        "storageKey": null,
        "args": [
          {
            "kind": "Variable",
            "name": "sale_id",
            "variableName": "saleID",
            "type": "String"
          }
        ],
        "concreteType": "Bidder",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "qualified_for_bidding",
            "args": null,
            "storageKey": null
          },
          v1
        ]
      },
      v1
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ConfirmBidRefetchQuery",
  "id": "9d766fcdd80005d680dd9145655fa6ab",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidRefetchQuery",
    "argumentDefinitions": v0,
    "selections": v2
  }
};
})();
(node as any).hash = '12cc69f9d8252cdd1c762eea37e5ae8f';
export default node;
