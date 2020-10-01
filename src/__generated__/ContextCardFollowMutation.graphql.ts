/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d492efc5bb01d11b8045f4bd9a8013d7 */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    clientMutationId?: string | null;
    partnerShowID?: string | null;
    unfollow?: boolean | null;
};
export type ContextCardFollowMutationVariables = {
    input: FollowShowInput;
};
export type ContextCardFollowMutationResponse = {
    readonly followShow: {
        readonly show: {
            readonly slug: string;
            readonly internalID: string;
            readonly isFollowed: boolean | null;
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
      isFollowed
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowShowPayload",
    "kind": "LinkedField",
    "name": "followShow",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
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
          },
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ContextCardFollowMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContextCardFollowMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "d492efc5bb01d11b8045f4bd9a8013d7",
    "metadata": {},
    "name": "ContextCardFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'd5670cb5205e24a337e07eec0afbf553';
export default node;
