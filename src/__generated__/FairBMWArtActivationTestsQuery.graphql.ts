/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairBMWArtActivationTestsQueryVariables = {};
export type FairBMWArtActivationTestsQueryResponse = {
    readonly fair: ({
        readonly gravityID: string;
        readonly internalID: string;
        readonly sponsoredContent: ({
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        }) | null;
    }) | null;
};
export type FairBMWArtActivationTestsQuery = {
    readonly response: FairBMWArtActivationTestsQueryResponse;
    readonly variables: FairBMWArtActivationTestsQueryVariables;
};



/*
query FairBMWArtActivationTestsQuery {
  fair(id: "art-basel-in-miami-beach-2018") {
    gravityID
    internalID
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
    "kind": "Literal",
    "name": "id",
    "value": "art-basel-in-miami-beach-2018",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
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
    "name": "FairBMWArtActivationTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBMWArtActivationTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
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
    "name": "FairBMWArtActivationTestsQuery",
    "id": "12397aa34f48c87c16800a8f2339ae29",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '12397aa34f48c87c16800a8f2339ae29';
export default node;
