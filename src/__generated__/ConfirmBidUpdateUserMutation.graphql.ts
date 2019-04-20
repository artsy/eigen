/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    readonly name?: string | null;
    readonly email?: string | null;
    readonly phone?: string | null;
    readonly location?: EditableLocation | null;
    readonly collector_level?: number | null;
    readonly price_range_min?: number | null;
    readonly price_range_max?: number | null;
    readonly clientMutationId?: string | null;
};
export type EditableLocation = {
    readonly address?: string | null;
    readonly address_2?: string | null;
    readonly city?: string | null;
    readonly country?: string | null;
    readonly summary?: string | null;
    readonly postal_code?: string | null;
    readonly state?: string | null;
    readonly state_code?: string | null;
};
export type ConfirmBidUpdateUserMutationVariables = {
    readonly input: UpdateMyProfileInput;
};
export type ConfirmBidUpdateUserMutationResponse = {
    readonly updateMyUserProfile: ({
        readonly clientMutationId: string | null;
        readonly user: ({
            readonly phone: string | null;
        }) | null;
    }) | null;
};
export type ConfirmBidUpdateUserMutation = {
    readonly response: ConfirmBidUpdateUserMutationResponse;
    readonly variables: ConfirmBidUpdateUserMutationVariables;
};



/*
mutation ConfirmBidUpdateUserMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    clientMutationId
    user {
      phone
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateMyProfileInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateMyUserProfile",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "UpdateMyProfileInput!"
      }
    ],
    "concreteType": "UpdateMyProfilePayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "clientMutationId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "phone",
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
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidUpdateUserMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidUpdateUserMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ConfirmBidUpdateUserMutation",
    "id": "30b967c971f3916e1e4e9f9213e83b41",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '30b967c971f3916e1e4e9f9213e83b41';
export default node;
