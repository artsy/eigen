/* tslint:disable */
/* eslint-disable */
/* @relayHash 93f7e61768d2391fb049efbd389314c5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2QueryVariables = {
    fairID: string;
};
export type Fair2QueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
    } | null;
};
export type Fair2Query = {
    readonly response: Fair2QueryResponse;
    readonly variables: Fair2QueryVariables;
};



/*
query Fair2Query(
  $fairID: String!
) {
  fair(id: $fairID) @principalField {
    ...Fair2_fair
    id
  }
}

fragment Fair2_fair on Fair {
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2Query",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair2_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2Query",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2Query",
    "id": "c548a6dd4c01976ab19263018b0d9f81",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b1f906d210896b4e7da4a511c6846b3a';
export default node;
