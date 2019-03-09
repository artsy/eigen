/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairBMWArtActivationQueryVariables = {
    readonly fairID: string;
};
export type FairBMWArtActivationQueryResponse = {
    readonly fair: ({
        readonly id: string;
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
    id
    _id
    sponsoredContent {
      activationText
      pressReleaseUrl
    }
    __id
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
    "kind": "LinkedField",
    "alias": null,
    "name": "fair",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "fairID",
        "type": "String!"
      }
    ],
    "concreteType": "Fair",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "_id",
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
        "alias": null,
        "name": "__id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairBMWArtActivationQuery",
  "id": "3d38512472e702bc62b341971a7eda55",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairBMWArtActivationQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBMWArtActivationQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '4ae1b4a57b61e1f7945a07675a1aa4c5';
export default node;
