/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    readonly profileID?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type PartnerCardFollowMutationVariables = {
    readonly input: FollowProfileInput;
};
export type PartnerCardFollowMutationResponse = {
    readonly followProfile: {
        readonly profile: {
            readonly id: string;
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type PartnerCardFollowMutation = {
    readonly response: PartnerCardFollowMutationResponse;
    readonly variables: PartnerCardFollowMutationVariables;
};



/*
mutation PartnerCardFollowMutation(
  $input: FollowProfileInput!
) {
  followProfile(input: $input) {
    profile {
      id
      slug
      internalID
      is_followed: isFollowed
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
            "name": "id",
            "args": null,
            "storageKey": null
          },
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
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_followed",
            "name": "isFollowed",
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
    "name": "PartnerCardFollowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerCardFollowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PartnerCardFollowMutation",
    "id": "48248313b514d25fe6222fdd2cc25dab",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a0a4c454804cc2315d016e42a33398fd';
export default node;
