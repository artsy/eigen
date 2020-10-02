/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d56c9ab97d9553bcc60be71e5bf293c8 */

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
export type FairBMWArtActivationTestsQueryRawResponse = {
    readonly fair: ({
        readonly slug: string;
        readonly internalID: string;
        readonly sponsoredContent: ({
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        }) | null;
        readonly id: string;
    }) | null;
};
export type FairBMWArtActivationTestsQuery = {
    readonly response: FairBMWArtActivationTestsQueryResponse;
    readonly variables: FairBMWArtActivationTestsQueryVariables;
    readonly rawResponse: FairBMWArtActivationTestsQueryRawResponse;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "FairSponsoredContent",
  "kind": "LinkedField",
  "name": "sponsoredContent",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "activationText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pressReleaseUrl",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FairBMWArtActivationTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FairBMWArtActivationTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")"
      }
    ]
  },
  "params": {
    "id": "d56c9ab97d9553bcc60be71e5bf293c8",
    "metadata": {},
    "name": "FairBMWArtActivationTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5c2bbcf323d28844b690bcd3e02655dd';
export default node;
