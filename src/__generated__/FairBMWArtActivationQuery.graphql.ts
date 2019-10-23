/* tslint:disable */

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
          {
            "kind": "FragmentSpread",
            "name": "FairBMWArtActivation_fair",
            "args": null
          }
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
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
    "id": "68cc3854a45b4d6ed04997d8c7e1dc2f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4ed1740e79921612fd90343f396d79bf';
export default node;
