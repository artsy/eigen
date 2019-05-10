/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairBMWArtActivationQueryVariables = {
    readonly fairID: string;
};
export type FairBMWArtActivationQueryResponse = {
    readonly fair: {
        readonly gravityID: string;
        readonly internalID: string;
        readonly sponsoredContent: {
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        } | null;
    } | null;
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
  "name": "internalID",
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
    "id": "a9052013f3c158869fa3957387d7a573",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '89db77148ba86762e83a265a07599b7a';
export default node;
