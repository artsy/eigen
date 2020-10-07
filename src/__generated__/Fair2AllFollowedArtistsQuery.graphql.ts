/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 883e6e2b5afbed3e2176b59fc2ace79d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2AllFollowedArtistsQueryVariables = {
    fairID: string;
};
export type Fair2AllFollowedArtistsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2AllFollowedArtists_fair">;
    } | null;
};
export type Fair2AllFollowedArtistsQuery = {
    readonly response: Fair2AllFollowedArtistsQueryResponse;
    readonly variables: Fair2AllFollowedArtistsQueryVariables;
};



/*
query Fair2AllFollowedArtistsQuery(
  $fairID: String!
) {
  fair(id: $fairID) @principalField {
    ...Fair2AllFollowedArtists_fair
    id
  }
}

fragment Fair2AllFollowedArtists_fair on Fair {
  name
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
    "name": "Fair2AllFollowedArtistsQuery",
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
            "name": "Fair2AllFollowedArtists_fair"
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
    "name": "Fair2AllFollowedArtistsQuery",
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
            "name": "name",
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
    "id": "883e6e2b5afbed3e2176b59fc2ace79d",
    "metadata": {},
    "name": "Fair2AllFollowedArtistsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '75ab8d0315a0c3772940f6dcafff8609';
export default node;
