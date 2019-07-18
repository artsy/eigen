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
    readonly followProfile: {
        readonly profile: {
            readonly slug: string;
            readonly is_followed: boolean | null;
            readonly id: string;
        } | null;
    } | null;
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
      slug
      is_followed
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
        "variableName": "input"
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
            "name": "slug",
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
  "fragment": {
    "kind": "Fragment",
    "name": "SavedFairItemRowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SavedFairItemRowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SavedFairItemRowMutation",
    "id": "6c47dcee1ed002b879543910cae86f52",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8ed0f2abbac2241a0c9b21e28aeace13';
export default node;
