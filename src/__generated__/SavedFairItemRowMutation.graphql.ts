/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    readonly profile_id?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type SavedFairItemRowMutationVariables = {
    readonly input: FollowProfileInput;
};
export type SavedFairItemRowMutationResponse = {
    readonly followProfile: ({
        readonly profile: ({
            readonly id: string;
            readonly is_followed: boolean | null;
            readonly __id: string;
        }) | null;
    }) | null;
};
export type SavedFairItemRowMutation = {
    readonly response: SavedFairItemRowMutationResponse;
    readonly variables: SavedFairItemRowMutationVariables;
};



/*
mutation SavedFairItemRowMutation(
  $input: FollowProfileInput!
) {
  followProfile(input: $input) {
    profile {
      id
      is_followed
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
    "type": "FollowProfileInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "followProfile",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "FollowProfileInput!"
      }
    ],
    "concreteType": "FollowProfilePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "profile",
        "storageKey": null,
        "args": null,
        "concreteType": "Profile",
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
            "name": "is_followed",
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
  "name": "SavedFairItemRowMutation",
  "id": "9cf2c5eb9b7d9b7d15a2ae33316c6205",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SavedFairItemRowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "SavedFairItemRowMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '9b5e1d82370a12ce6e307eb5cc2bb258';
export default node;
