/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0ac9711f91281df7c2ce24f14369e58a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV2QueryVariables = {};
export type CreateSavedSearchContentContainerV2QueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
    } | null;
};
export type CreateSavedSearchContentContainerV2Query = {
    readonly response: CreateSavedSearchContentContainerV2QueryResponse;
    readonly variables: CreateSavedSearchContentContainerV2QueryVariables;
};



/*
query CreateSavedSearchContentContainerV2Query {
  me {
    ...CreateSavedSearchContentContainerV2_me
    id
  }
}

fragment CreateSavedSearchContentContainerV2_me on Me {
  emailFrequency
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSavedSearchContentContainerV2Query",
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
            "name": "CreateSavedSearchContentContainerV2_me"
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
    "name": "CreateSavedSearchContentContainerV2Query",
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
            "name": "emailFrequency",
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
    "id": "0ac9711f91281df7c2ce24f14369e58a",
    "metadata": {},
    "name": "CreateSavedSearchContentContainerV2Query",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'a2498d1873550bd3f9aec3b590625ed7';
export default node;
