/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type BidderPositionQueryVariables = {
    readonly bidderPositionID: string;
};
export type BidderPositionQueryResponse = {
    readonly me: {
        readonly bidder_position: {
            readonly status: string;
            readonly message_header: string | null;
            readonly message_description_md: string | null;
            readonly position: {
                readonly internalID: string;
                readonly suggested_next_bid: {
                    readonly cents: number | null;
                    readonly display: string | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type BidderPositionQuery = {
    readonly response: BidderPositionQueryResponse;
    readonly variables: BidderPositionQueryVariables;
};



/*
query BidderPositionQuery(
  $bidderPositionID: String!
) {
  me {
    bidder_position(id: $bidderPositionID) {
      status
      message_header
      message_description_md
      position {
        internalID
        suggested_next_bid {
          cents
          display
        }
        id
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "bidderPositionID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "bidderPositionID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "message_header",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "message_description_md",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "suggested_next_bid",
  "storageKey": null,
  "args": null,
  "concreteType": "BidderPositionSuggestedNextBid",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cents",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "display",
      "args": null,
      "storageKey": null
    }
  ]
},
v7 = {
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
    "name": "BidderPositionQuery",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "bidder_position",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "BidderPositionResult",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "position",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
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
    "name": "BidderPositionQuery",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "bidder_position",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "BidderPositionResult",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "position",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
                ]
              }
            ]
          },
          (v7/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "BidderPositionQuery",
    "id": "98603de89d8987e353250349ddb56622",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '73d51ddc650a8f1a9de4b01ac6b762eb';
export default node;
