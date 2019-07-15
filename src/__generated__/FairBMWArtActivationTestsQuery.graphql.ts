/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairBMWArtActivationTestsQueryVariables = {};
export type FairBMWArtActivationTestsQueryResponse = {
    readonly fair: {
        readonly slug: string;
        readonly internalID: string;
        readonly sponsoredContent: {
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        } | null;
    } | null;
};
export type FairBMWArtActivationTestsQuery = {
    readonly response: FairBMWArtActivationTestsQueryResponse;
    readonly variables: FairBMWArtActivationTestsQueryVariables;
};



/*
query FairBMWArtActivationTestsQuery {
  fair(id: "art-basel-in-miami-beach-2018") {
    slug
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
    "value": "art-basel-in-miami-beach-2018"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
    "id": "d56c9ab97d9553bcc60be71e5bf293c8",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '9a435ad01c3ab13df103b7660ef56d1b';
export default node;
