/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type CreateBidderInput = {
    readonly sale_id: string;
    readonly clientMutationId?: string | null;
};
export type RegistrationCreateBidderMutationVariables = {
    readonly input: CreateBidderInput;
};
export type RegistrationCreateBidderMutationResponse = {
    readonly createBidder: ({
        readonly bidder: ({
            readonly gravityID: string;
            readonly qualified_for_bidding: boolean | null;
        }) | null;
    }) | null;
};
export type RegistrationCreateBidderMutation = {
    readonly response: RegistrationCreateBidderMutationResponse;
    readonly variables: RegistrationCreateBidderMutationVariables;
};



/*
mutation RegistrationCreateBidderMutation(
  $input: CreateBidderInput!
) {
  createBidder(input: $input) {
    bidder {
      gravityID
      qualified_for_bidding
      __id: id
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
            "name": "gravityID",
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
            "alias": "__id",
            "name": "id",
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
  "id": null,
  "text": "mutation RegistrationCreateBidderMutation(\n  $input: CreateBidderInput!\n) {\n  createBidder(input: $input) {\n    bidder {\n      gravityID\n      qualified_for_bidding\n      __id: id\n    }\n  }\n}\n",
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
(node as any).hash = '415793ff340365341149ed83366d2edd';
export default node;
