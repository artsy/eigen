/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type RegistrationCreateBidderMutationVariables = {
    readonly input: {
        readonly sale_id?: string;
        readonly clientMutationId: string | null;
    };
};
export type RegistrationCreateBidderMutationResponse = {
    readonly createBidder: ({
        readonly bidder: ({
            readonly id: string;
            readonly qualified_for_bidding: boolean | null;
        }) | null;
    }) | null;
};



/*
mutation RegistrationCreateBidderMutation(
  $input: CreateBidderInput!
) {
  createBidder(input: $input) {
    bidder {
      id
      qualified_for_bidding
      __id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateBidderInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createBidder",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "CreateBidderInput!"
      }
    ],
    "concreteType": "CreateBidderPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "bidder",
        "storageKey": null,
        "args": null,
        "concreteType": "Bidder",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "qualified_for_bidding",
            "args": null,
            "storageKey": null
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
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "RegistrationCreateBidderMutation",
  "id": "5adb7100b533a36426ccc810956fd44a",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "RegistrationCreateBidderMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "RegistrationCreateBidderMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '08d945c676043d45265618182413bb99';
export default node;
