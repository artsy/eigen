/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 68cc3854a45b4d6ed04997d8c7e1dc2f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairBMWArtActivationQueryVariables = {
    fairID: string;
};
export type FairBMWArtActivationQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairBMWArtActivation_fair">;
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
    ...FairBMWArtActivation_fair
    id
  }
}

fragment FairBMWArtActivation_fair on Fair {
  slug
  internalID
  sponsoredContent {
    activationText
    pressReleaseUrl
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
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
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairBMWArtActivationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairBMWArtActivation_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairBMWArtActivationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "68cc3854a45b4d6ed04997d8c7e1dc2f",
    "metadata": {},
    "name": "FairBMWArtActivationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '4ed1740e79921612fd90343f396d79bf';
export default node;
