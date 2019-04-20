/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairBMWArtActivationQueryVariables = {
    readonly fairID: string;
};
export type FairBMWArtActivationQueryResponse = {
    readonly fair: ({
        readonly gravityID: string;
        readonly _id: string;
        readonly sponsoredContent: ({
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        }) | null;
    }) | null;
};
export type FairBMWArtActivationQuery = {
    readonly response: FairBMWArtActivationQueryResponse;
    readonly variables: FairBMWArtActivationQueryVariables;
};



/*
query FairBMWArtActivationQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    gravityID
    _id
    sponsoredContent {
      activationText
      pressReleaseUrl
    }
    id
  }
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
    "variableName": "fairID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "sponsoredContent",
  "storageKey": null,
  "args": null,
  "concreteType": "FairSponsoredContent",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "activationText",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "pressReleaseUrl",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairBMWArtActivationQuery",
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBMWArtActivationQuery",
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "name": "FairBMWArtActivationQuery",
    "id": "c3c26092b367e194ee00121f2af83b77",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c3c26092b367e194ee00121f2af83b77';
export default node;
