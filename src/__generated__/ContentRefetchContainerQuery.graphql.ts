/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 27dce02377153de6ad3746194f00c637 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ContentRefetchContainerQueryVariables = {};
export type ContentRefetchContainerQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ContentRefetchContainer_me">;
    } | null;
};
export type ContentRefetchContainerQuery = {
    readonly response: ContentRefetchContainerQueryResponse;
    readonly variables: ContentRefetchContainerQueryVariables;
};



/*
query ContentRefetchContainerQuery {
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
    "name": "ContentRefetchContainerQuery",
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
    "name": "ContentRefetchContainerQuery",
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
    "id": "27dce02377153de6ad3746194f00c637",
    "metadata": {},
    "name": "ContentRefetchContainerQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'b608bc1a6f602eab23511199f5cc98e4';
export default node;
