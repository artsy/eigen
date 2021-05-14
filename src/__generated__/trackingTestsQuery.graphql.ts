/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 6a51fe64b3e19f036cbbc837c1b0b3e8 */

import { ConcreteRequest } from "relay-runtime";
export type trackingTestsQueryVariables = {};
export type trackingTestsQueryResponse = {
    readonly me: {
        readonly name: string | null;
    } | null;
};
export type trackingTestsQuery = {
    readonly response: trackingTestsQueryResponse;
    readonly variables: trackingTestsQueryVariables;
};



/*
query trackingTestsQuery {
  me {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "trackingTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/)
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
    "name": "trackingTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    "id": "6a51fe64b3e19f036cbbc837c1b0b3e8",
    "metadata": {},
    "name": "trackingTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '615152aadeec3c5c403c97236ca2efb4';
export default node;
