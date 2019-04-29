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
    __id: id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "fair",
    "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "art-basel-in-miami-beach-2018",
        "type": "String!"
      }
    ],
    "concreteType": "Fair",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "gravityID",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "internalID",
        "args": null,
        "storageKey": null
      },
      {
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
      },
      {
        "kind": "ScalarField",
        "alias": "__id",
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairBMWArtActivationTestsQuery",
  "id": null,
  "text": "query FairBMWArtActivationTestsQuery {\n  fair(id: \"art-basel-in-miami-beach-2018\") {\n    gravityID\n    internalID\n    sponsoredContent {\n      activationText\n      pressReleaseUrl\n    }\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairBMWArtActivationTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBMWArtActivationTestsQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
(node as any).hash = '12397aa34f48c87c16800a8f2339ae29';
export default node;
