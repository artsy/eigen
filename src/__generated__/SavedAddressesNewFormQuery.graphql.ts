/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cd55a7916992a5d4da71c183b8cff159 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedAddressesNewFormQueryVariables = {};
export type SavedAddressesNewFormQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedAddressesNewForm_me">;
    } | null;
};
export type SavedAddressesNewFormQuery = {
    readonly response: SavedAddressesNewFormQueryResponse;
    readonly variables: SavedAddressesNewFormQueryVariables;
};



/*
query SavedAddressesNewFormQuery {
  me {
    ...SavedAddressesNewForm_me
    id
  }
}

fragment SavedAddressesNewForm_me on Me {
  id
  phone
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedAddressesNewFormQuery",
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
            "name": "SavedAddressesNewForm_me"
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
    "name": "SavedAddressesNewFormQuery",
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
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "phone",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "cd55a7916992a5d4da71c183b8cff159",
    "metadata": {},
    "name": "SavedAddressesNewFormQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '567f6f34e4471f91202f165267128345';
export default node;
