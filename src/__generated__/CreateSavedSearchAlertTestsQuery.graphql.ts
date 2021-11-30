/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 952339cebec96492825e0beb0857324d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertTestsQueryVariables = {};
export type CreateSavedSearchAlertTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchAlertScreen_me">;
    } | null;
};
export type CreateSavedSearchAlertTestsQuery = {
    readonly response: CreateSavedSearchAlertTestsQueryResponse;
    readonly variables: CreateSavedSearchAlertTestsQueryVariables;
};



/*
query CreateSavedSearchAlertTestsQuery {
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
    "name": "CreateSavedSearchAlertTestsQuery",
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
    "name": "CreateSavedSearchAlertTestsQuery",
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
    "id": "952339cebec96492825e0beb0857324d",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.emailFrequency": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "me.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        }
      }
    },
    "name": "CreateSavedSearchAlertTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '5cec524a39eb01adf1ff1221a283af08';
export default node;
