/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ConfirmBidMutationVariables = {
    readonly input: {
        readonly sale_id?: string;
        readonly artwork_id?: string;
        readonly max_bid_amount_cents?: number;
        readonly clientMutationId: string | null;
    };
};
export type ConfirmBidMutationResponse = {
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
mutation ConfirmBidMutation(
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
  "name": "ConfirmBidMutation",
  "id": "c47e7e55e759e79bfd93ede1c0457b1e",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = 'e0fe522d90c0aa543a6b3d34da4d7f82';
export default node;
