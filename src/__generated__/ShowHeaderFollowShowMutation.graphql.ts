/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d6dcea734ed2c6dc355355d8a3a1c833 */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    clientMutationId?: string | null;
    partnerShowID?: string | null;
    unfollow?: boolean | null;
};
export type ShowHeaderFollowShowMutationVariables = {
    input: FollowShowInput;
};
export type ShowHeaderFollowShowMutationResponse = {
    readonly followShow: {
        readonly show: {
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type ShowHeaderFollowShowMutation = {
    readonly response: ShowHeaderFollowShowMutationResponse;
    readonly variables: ShowHeaderFollowShowMutationVariables;
};



/*
mutation ShowHeaderFollowShowMutation(
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
    "name": "ShowHeaderFollowShowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "name": "ShowHeaderFollowShowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "id": "d6dcea734ed2c6dc355355d8a3a1c833",
    "metadata": {},
    "name": "ShowHeaderFollowShowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c6d7386195fa69df1834a4f120251101';
export default node;
