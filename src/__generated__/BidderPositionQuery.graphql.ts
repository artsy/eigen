/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash dab411c27ae5496a83799e2909ef0d29 */

import { ConcreteRequest } from "relay-runtime";
export type BidderPositionQueryVariables = {
    bidderPositionID: string;
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
    bidder_position: bidderPosition(id: $bidderPositionID) {
      status
      message_header: messageHeader
      message_description_md: messageDescriptionMD
      position {
        internalID
        suggested_next_bid: suggestedNextBid {
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "bidderPositionID"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v3 = {
  "alias": "message_header",
  "args": null,
  "kind": "ScalarField",
  "name": "messageHeader",
  "storageKey": null
},
v4 = {
  "alias": "message_description_md",
  "args": null,
  "kind": "ScalarField",
  "name": "messageDescriptionMD",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v6 = {
  "alias": "suggested_next_bid",
  "args": null,
  "concreteType": "BidderPositionSuggestedNextBid",
  "kind": "LinkedField",
  "name": "suggestedNextBid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BidderPositionQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": "bidder_position",
            "args": (v1/*: any*/),
            "concreteType": "BidderPositionResult",
            "kind": "LinkedField",
            "name": "bidderPosition",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "position",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
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
    "name": "BidderPositionQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": "bidder_position",
            "args": (v1/*: any*/),
            "concreteType": "BidderPositionResult",
            "kind": "LinkedField",
            "name": "bidderPosition",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "position",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "dab411c27ae5496a83799e2909ef0d29",
    "metadata": {},
    "name": "BidderPositionQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6089ac2a12e9fe3d68fdc3531aedbf62';
export default node;
