/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ConfirmBidRefetchQueryVariables = {
    readonly saleID: string;
};
export type ConfirmBidRefetchQueryResponse = {
    readonly me: {
        readonly has_qualified_credit_cards: boolean | null;
        readonly bidders: ReadonlyArray<{
            readonly qualified_for_bidding: boolean | null;
        } | null> | null;
    } | null;
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
    has_qualified_credit_cards: hasQualifiedCreditCards
    bidders(saleID: $saleID) {
      qualified_for_bidding: qualifiedForBidding
      id
    }
    id
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
  "alias": "has_qualified_credit_cards",
  "name": "hasQualifiedCreditCards",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "Variable",
    "name": "saleID",
    "variableName": "saleID"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": "qualified_for_bidding",
  "name": "qualifiedForBidding",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "bidders",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "Bidder",
            "plural": true,
            "selections": [
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "bidders",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "Bidder",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConfirmBidRefetchQuery",
    "id": "5a4cf26f4fd23009e67008c634e06a57",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd51babc8a4e214e0ab945cdf1587144f';
export default node;
