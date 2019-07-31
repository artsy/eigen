/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    readonly name?: string | null;
    readonly email?: string | null;
    readonly phone?: string | null;
    readonly location?: EditableLocation | null;
    readonly collectorLevel?: number | null;
    readonly priceRangeMin?: number | null;
    readonly priceRangeMax?: number | null;
    readonly clientMutationId?: string | null;
};
export type EditableLocation = {
    readonly address?: string | null;
    readonly address2?: string | null;
    readonly city?: string | null;
    readonly country?: string | null;
    readonly summary?: string | null;
    readonly postalCode?: string | null;
    readonly state?: string | null;
    readonly stateCode?: string | null;
};
export type ConfirmBidUpdateUserMutationVariables = {
    readonly input: UpdateMyProfileInput;
};
export type ConfirmBidUpdateUserMutationResponse = {
    readonly updateMyUserProfile: {
        readonly clientMutationId: string | null;
        readonly user: {
            readonly phone: string | null;
        } | null;
    } | null;
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
      id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "clientMutationId",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "phone",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidUpdateUserMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
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
    "name": "ConfirmBidUpdateUserMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
  },
  "params": {
    "operationKind": "mutation",
    "name": "ConfirmBidUpdateUserMutation",
    "id": "3580c0fe3b32d9febb4e67be71192572",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '30b967c971f3916e1e4e9f9213e83b41';
export default node;
