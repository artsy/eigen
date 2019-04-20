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
            readonly gravityID: string;
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
      gravityID
      _id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "FollowProfileInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairBoothPreviewMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBoothPreviewMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
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
    "name": "FairBoothPreviewMutation",
    "id": "c29898d991e3f13d3d1ddc349a76e234",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c29898d991e3f13d3d1ddc349a76e234';
export default node;
