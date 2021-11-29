/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c9f82fd4266d2f528cfec2bcdc589d02 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertTestsQueryVariables = {};
export type CreateSavedSearchAlertTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ContentRefetchContainer_me">;
    } | null;
};
export type CreateSavedSearchAlertTestsQuery = {
    readonly response: CreateSavedSearchAlertTestsQueryResponse;
    readonly variables: CreateSavedSearchAlertTestsQueryVariables;
};



/*
query CreateSavedSearchAlertTestsQuery {
  me {
    ...ContentRefetchContainer_me
    id
  }
}

fragment ContentRefetchContainer_me on Me {
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
            "name": "ContentRefetchContainer_me"
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
    "id": "c9f82fd4266d2f528cfec2bcdc589d02",
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
(node as any).hash = '6b2e5c8447e00a139d681cecaa720fba';
export default node;
