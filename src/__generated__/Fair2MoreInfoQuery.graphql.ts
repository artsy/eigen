/* tslint:disable */
/* eslint-disable */
/* @relayHash 281b6e303689af82c7c59bcd932f5dff */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfoQueryVariables = {
    fairID: string;
};
export type Fair2MoreInfoQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2MoreInfo_fair">;
    } | null;
};
export type Fair2MoreInfoQuery = {
    readonly response: Fair2MoreInfoQueryResponse;
    readonly variables: Fair2MoreInfoQueryVariables;
};



/*
query Fair2MoreInfoQuery(
  $fairID: String!
) {
  fair(id: $fairID) @principalField {
    ...Fair2MoreInfo_fair
    id
  }
}

fragment Fair2MoreInfo_fair on Fair {
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
    "name": "Fair2MoreInfoQuery",
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
            "name": "Fair2MoreInfo_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2MoreInfoQuery",
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
    "name": "Fair2MoreInfoQuery",
    "id": "74cf5002917c67948cfc73d444c195cd",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c0b78e780c064aed6d48946928a2bcb0';
export default node;
