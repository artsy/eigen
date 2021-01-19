/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cd31dc8fb00fae2c615f6b8ee24d3b2a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConfirmContactInfoQueryVariables = {};
export type ConfirmContactInfoQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ConfirmContactInfo_me">;
    } | null;
};
export type ConfirmContactInfoQuery = {
    readonly response: ConfirmContactInfoQueryResponse;
    readonly variables: ConfirmContactInfoQueryVariables;
};



/*
query ConfirmContactInfoQuery {
  me {
    ...ConfirmContactInfo_me
    id
  }
}

fragment ConfirmContactInfo_me on Me {
  phone
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ConfirmContactInfoQuery",
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
            "name": "ConfirmContactInfo_me"
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
    "name": "ConfirmContactInfoQuery",
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
            "name": "phone",
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
    "id": "cd31dc8fb00fae2c615f6b8ee24d3b2a",
    "metadata": {},
    "name": "ConfirmContactInfoQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '5c92c404c64b8607044faf8854bfe012';
export default node;
