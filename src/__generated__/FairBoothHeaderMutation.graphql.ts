/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 88ea9bf65ed7340059e0307e6f048f7b */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    clientMutationId?: string | null;
    profileID?: string | null;
    unfollow?: boolean | null;
};
export type FairBoothHeaderMutationVariables = {
    input: FollowProfileInput;
};
export type FairBoothHeaderMutationResponse = {
    readonly followProfile: {
        readonly profile: {
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type FairBoothHeaderMutation = {
    readonly response: FairBoothHeaderMutationResponse;
    readonly variables: FairBoothHeaderMutationVariables;
};



/*
mutation FairBoothHeaderMutation(
  $input: FollowProfileInput!
) {
  followProfile(input: $input) {
    profile {
      slug
      internalID
      is_followed: isFollowed
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": "is_followed",
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairBoothHeaderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FollowProfilePayload",
        "kind": "LinkedField",
        "name": "followProfile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Profile",
            "kind": "LinkedField",
            "name": "profile",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairBoothHeaderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FollowProfilePayload",
        "kind": "LinkedField",
        "name": "followProfile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Profile",
            "kind": "LinkedField",
            "name": "profile",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "88ea9bf65ed7340059e0307e6f048f7b",
    "metadata": {},
    "name": "FairBoothHeaderMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c9ba58d8a57fdc6c027f6351edaaf63a';
export default node;
