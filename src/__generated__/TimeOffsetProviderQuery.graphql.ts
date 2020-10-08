/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2a9481ee99ef977b10d9916f3943a168 */

import { ConcreteRequest } from "relay-runtime";
export type TimeOffsetProviderQueryVariables = {};
export type TimeOffsetProviderQueryResponse = {
    readonly system: {
        readonly time: {
            readonly unix: number | null;
        } | null;
    } | null;
};
export type TimeOffsetProviderQuery = {
    readonly response: TimeOffsetProviderQueryResponse;
    readonly variables: TimeOffsetProviderQueryVariables;
};



/*
query TimeOffsetProviderQuery {
  system {
    time {
      unix
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "System",
    "kind": "LinkedField",
    "name": "system",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SystemTime",
        "kind": "LinkedField",
        "name": "time",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "unix",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TimeOffsetProviderQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TimeOffsetProviderQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "2a9481ee99ef977b10d9916f3943a168",
    "metadata": {},
    "name": "TimeOffsetProviderQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ff8ce7414100bd7ef9284bc9352ade24';
export default node;
