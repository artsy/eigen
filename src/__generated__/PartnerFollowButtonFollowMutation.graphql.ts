/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f4c2974e310ac286342fa182af841885 */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    clientMutationId?: string | null;
    profileID?: string | null;
    unfollow?: boolean | null;
};
export type PartnerFollowButtonFollowMutationVariables = {
    input: FollowProfileInput;
};
export type PartnerFollowButtonFollowMutationResponse = {
    readonly followProfile: {
        readonly profile: {
            readonly id: string;
            readonly slug: string;
            readonly internalID: string;
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type PartnerFollowButtonFollowMutation = {
    readonly response: PartnerFollowButtonFollowMutationResponse;
    readonly variables: PartnerFollowButtonFollowMutationVariables;
};



/*
mutation PartnerFollowButtonFollowMutation(
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
    "name": "PartnerFollowButtonFollowMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PartnerFollowButtonFollowMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "f4c2974e310ac286342fa182af841885",
    "metadata": {},
    "name": "PartnerFollowButtonFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'f6fcbe66e5993810a7dacca675e0c384';
export default node;
