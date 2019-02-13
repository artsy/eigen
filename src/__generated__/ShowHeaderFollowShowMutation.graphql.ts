/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    readonly partner_show_id?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type ShowHeaderFollowShowMutationVariables = {
    readonly input: FollowShowInput;
};
export type ShowHeaderFollowShowMutationResponse = {
    readonly followShow: ({
        readonly show: ({
            readonly __id: string;
            readonly is_followed: boolean | null;
        }) | null;
    }) | null;
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
      __id
      is_followed
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
        "variableName": "input",
        "type": "FollowShowInput!"
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
            "name": "__id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_followed",
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
  "operationKind": "mutation",
  "name": "ShowHeaderFollowShowMutation",
  "id": "fb6c2528015464ea7ef9fe206780e3e0",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowHeaderFollowShowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowHeaderFollowShowMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '0a0a79cb93081f072a446a1b49ee2980';
export default node;
