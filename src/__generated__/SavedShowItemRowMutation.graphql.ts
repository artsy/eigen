/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    readonly partner_show_id?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type SavedShowItemRowMutationVariables = {
    readonly input: FollowShowInput;
};
export type SavedShowItemRowMutationResponse = {
    readonly followShow: ({
        readonly show: ({
            readonly id: string;
            readonly is_followed: boolean | null;
            readonly _id: string;
        }) | null;
    }) | null;
};
export type SavedShowItemRowMutation = {
    readonly response: SavedShowItemRowMutationResponse;
    readonly variables: SavedShowItemRowMutationVariables;
};



/*
mutation SavedShowItemRowMutation(
  $input: FollowShowInput!
) {
  followShow(input: $input) {
    show {
      id
      is_followed
      _id
      __id
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
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_followed",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__id",
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
  "name": "SavedShowItemRowMutation",
  "id": "23c88d2f195e689fe3750d54294cebb4",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SavedShowItemRowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "SavedShowItemRowMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '1419b0a6bf4e1181ef01083d4c85bc43';
export default node;
