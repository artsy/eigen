/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ConfirmBidCreateBidderPositionMutationVariables = {
    readonly input: {
        readonly sale_id?: string;
        readonly artwork_id?: string;
        readonly max_bid_amount_cents?: number;
        readonly clientMutationId: string | null;
    };
};
export type ConfirmBidCreateBidderPositionMutationResponse = {
    readonly createBidderPosition: ({
        readonly result: ({
            readonly status: string;
            readonly message_header: string | null;
            readonly message_description_md: string | null;
            readonly position: ({
                readonly id: string;
                readonly suggested_next_bid: ({
                    readonly cents: number | null;
                    readonly display: string | null;
                }) | null;
            }) | null;
        }) | null;
    }) | null;
};



/*
mutation ConfirmBidCreateBidderPositionMutation(
  $input: BidderPositionInput!
) {
  createBidderPosition(input: $input) {
    result {
      status
      message_header
      message_description_md
      position {
        id
        suggested_next_bid {
          cents
          display
        }
        __id
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
    "kind": "LinkedField",
    "alias": null,
    "name": "createBidderPosition",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "BidderPositionInput!"
      }
    ],
    "concreteType": "BidderPositionPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "result",
        "storageKey": null,
        "args": null,
        "concreteType": "BidderPositionMutationResult",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "message_header",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "message_description_md",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "position",
            "storageKey": null,
            "args": null,
            "concreteType": "BidderPosition",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              {
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ConfirmBidCreateBidderPositionMutation",
  "id": "6dc901d7cf30a2e5778b669b04fe3d35",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidCreateBidderPositionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidCreateBidderPositionMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '90b2051c0e404dbb3d3b528a9dbca3ff';
export default node;
