/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e01d9128f1dbf7abcaac41f6f7f9b87f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertScreenRefetchQueryVariables = {};
export type CreateSavedSearchAlertScreenRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchAlertScreen_me">;
    } | null;
};
export type CreateSavedSearchAlertScreenRefetchQuery = {
    readonly response: CreateSavedSearchAlertScreenRefetchQueryResponse;
    readonly variables: CreateSavedSearchAlertScreenRefetchQueryVariables;
};



/*
query CreateSavedSearchAlertScreenRefetchQuery {
  me {
    ...CreateSavedSearchAlertScreen_me
    id
  }
}

fragment CreateSavedSearchAlertScreen_me on Me {
  emailFrequency
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSavedSearchAlertScreenRefetchQuery",
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
            "name": "CreateSavedSearchAlertScreen_me"
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
    "name": "CreateSavedSearchAlertScreenRefetchQuery",
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
    "id": "e01d9128f1dbf7abcaac41f6f7f9b87f",
    "metadata": {},
    "name": "CreateSavedSearchAlertScreenRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '90158348c2a8c52bddbfc9bb9b904937';
export default node;
