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
    readonly followProfile: {
        readonly profile: {
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
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
      slug
      internalID
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
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
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
    "id": "bce709b95ad18d903af51997c516de6e",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b0cdcd55dd2a09f0aa31d15b2b28abc8';
export default node;
