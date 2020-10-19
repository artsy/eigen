/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7d69ced7249d5f5cbd4da634c24ad4bb */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoggedInUserInfoQueryVariables = {};
export type LoggedInUserInfoQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"LoggedInUserInfo_me">;
    } | null;
};
export type LoggedInUserInfoQuery = {
    readonly response: LoggedInUserInfoQueryResponse;
    readonly variables: LoggedInUserInfoQueryVariables;
};



/*
query LoggedInUserInfoQuery {
  me {
    ...LoggedInUserInfo_me
    id
  }
}

fragment LoggedInUserInfo_me on Me {
  name
  email
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoggedInUserInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LoggedInUserInfo_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LoggedInUserInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
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
    ]
  },
  "params": {
    "id": "7d69ced7249d5f5cbd4da634c24ad4bb",
    "metadata": {},
    "name": "LoggedInUserInfoQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'e4f8e948db43ff716fec9355c45857d0';
export default node;
