/* tslint:disable */

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
    "kind": "LinkedField",
    "alias": null,
    "name": "system",
    "storageKey": null,
    "args": null,
    "concreteType": "System",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "time",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemTime",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "unix",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "TimeOffsetProviderQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "TimeOffsetProviderQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "TimeOffsetProviderQuery",
    "id": "2a9481ee99ef977b10d9916f3943a168",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ff8ce7414100bd7ef9284bc9352ade24';
export default node;
