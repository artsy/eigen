/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    readonly partnerShowID?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type ContextCardFollowMutationVariables = {
    readonly input: FollowShowInput;
};
export type ContextCardFollowMutationResponse = {
    readonly followShow: {
        readonly show: {
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
            readonly id: string;
        } | null;
    } | null;
};
export type ContextCardFollowMutation = {
    readonly response: ContextCardFollowMutationResponse;
    readonly variables: ContextCardFollowMutationVariables;
};



/*
mutation ContextCardFollowMutation(
  $input: FollowShowInput!
) {
  followShow(input: $input) {
    show {
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "FollowShowInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "followShow",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowShowPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": null,
        "concreteType": "Show",
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
    "name": "ContextCardFollowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ContextCardFollowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ContextCardFollowMutation",
    "id": "21c3b692a0a5a7285359d5d74c4cc7b7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd66bb4d85639e8f70731c332a3674ad9';
export default node;
