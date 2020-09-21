/* tslint:disable */
/* eslint-disable */
/* @relayHash ab74fb9ad6bf01242cd8e894910a0ebf */

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

fragment Fair2Header_fair on Fair {
  name
}

fragment Fair2_fair on Fair {
  ...Fair2Header_fair
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
    "id": "92092bc65f6a3333827b7c6cae7a77ed",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b1f906d210896b4e7da4a511c6846b3a';
export default node;
