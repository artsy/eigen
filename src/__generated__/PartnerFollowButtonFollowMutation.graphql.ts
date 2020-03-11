/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowProfileInput = {
    readonly profileID?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
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
            "alias": null,
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
    "name": "PartnerFollowButtonFollowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerFollowButtonFollowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PartnerFollowButtonFollowMutation",
    "id": "f4c2974e310ac286342fa182af841885",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'f6fcbe66e5993810a7dacca675e0c384';
export default node;
