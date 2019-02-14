/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    readonly profile_id?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type FairBoothPreviewMutationVariables = {
    readonly input: FollowProfileInput;
};
export type FairBoothPreviewMutationResponse = {
    readonly followProfile: ({
        readonly profile: ({
            readonly id: string;
            readonly _id: string;
            readonly is_followed: boolean | null;
        }) | null;
    }) | null;
};
export type FairBoothPreviewMutation = {
    readonly response: FairBoothPreviewMutationResponse;
    readonly variables: FairBoothPreviewMutationVariables;
};



/*
mutation FairBoothPreviewMutation(
  $input: FollowProfileInput!
) {
  followProfile(input: $input) {
    profile {
      id
      _id
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
            "name": "_id",
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
  "name": "FairBoothPreviewMutation",
  "id": "0c1010a8dedeee8e56d6342af4e5b83e",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairBoothPreviewMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBoothPreviewMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '032e6ecdb175dc6f4a8494290f71c078';
export default node;
