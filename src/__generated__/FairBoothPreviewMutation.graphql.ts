/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f135de64aecf1f33218a65b94d43af44 */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    clientMutationId?: string | null;
    profileID?: string | null;
    unfollow?: boolean | null;
};
export type FairBoothPreviewMutationVariables = {
    input: FollowProfileInput;
};
export type FairBoothPreviewMutationResponse = {
    readonly followProfile: {
        readonly profile: {
            readonly id: string;
            readonly slug: string;
            readonly internalID: string;
            readonly isFollowed: boolean | null;
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
      id
      slug
      internalID
      isFollowed
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairBoothPreviewMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairBoothPreviewMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "f135de64aecf1f33218a65b94d43af44",
    "metadata": {},
    "name": "FairBoothPreviewMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '246d8dbaaee607fce95e8c6ad4be0e6d';
export default node;
