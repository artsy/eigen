/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5f83a293e2149669ee69cff774a0dca8 */

import { ConcreteRequest } from "relay-runtime";
export type BidderPositionInput = {
    artworkID: string;
    clientMutationId?: string | null;
    maxBidAmountCents: number;
    saleID: string;
};
export type ConfirmBidCreateBidderPositionMutationVariables = {
    input: BidderPositionInput;
};
export type ConfirmBidCreateBidderPositionMutationResponse = {
    readonly createBidderPosition: {
        readonly result: {
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
export type ConfirmBidCreateBidderPositionMutation = {
    readonly response: ConfirmBidCreateBidderPositionMutationResponse;
    readonly variables: ConfirmBidCreateBidderPositionMutationVariables;
};



/*
mutation ConfirmBidCreateBidderPositionMutation(
  $input: BidderPositionInput!
) {
  createBidderPosition(input: $input) {
    result {
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
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConfirmBidCreateBidderPositionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BidderPositionPayload",
        "kind": "LinkedField",
        "name": "createBidderPosition",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BidderPositionResult",
            "kind": "LinkedField",
            "name": "result",
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ConfirmBidCreateBidderPositionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BidderPositionPayload",
        "kind": "LinkedField",
        "name": "createBidderPosition",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BidderPositionResult",
            "kind": "LinkedField",
            "name": "result",
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "5f83a293e2149669ee69cff774a0dca8",
    "metadata": {},
    "name": "ConfirmBidCreateBidderPositionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '003cf3f6fb78a218c5e89f8dc099a4ab';
export default node;
