/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type BidderPositionInput = {
    readonly saleID: string;
    readonly artworkID: string;
    readonly maxBidAmountCents: number;
    readonly clientMutationId?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "BidderPositionInput!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": "message_header",
  "name": "messageHeader",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": "message_description_md",
  "name": "messageDescriptionMD",
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
  "alias": "suggested_next_bid",
  "name": "suggestedNextBid",
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidCreateBidderPositionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createBidderPosition",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "BidderPositionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "result",
            "storageKey": null,
            "args": null,
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
    "name": "ConfirmBidCreateBidderPositionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createBidderPosition",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "BidderPositionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "result",
            "storageKey": null,
            "args": null,
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
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
    "operationKind": "mutation",
    "name": "ConfirmBidCreateBidderPositionMutation",
    "id": "5f83a293e2149669ee69cff774a0dca8",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '003cf3f6fb78a218c5e89f8dc099a4ab';
export default node;
