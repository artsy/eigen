/* tslint:disable */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "LoggedInUserInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "LoggedInUserInfo_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LoggedInUserInfoQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "email",
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
  },
  "params": {
    "operationKind": "query",
    "name": "LoggedInUserInfoQuery",
    "id": "7d69ced7249d5f5cbd4da634c24ad4bb",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'e4f8e948db43ff716fec9355c45857d0';
export default node;
