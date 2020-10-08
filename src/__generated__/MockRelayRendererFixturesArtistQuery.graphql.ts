/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cbf4686647f004d150e5f1a608cbe861 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MockRelayRendererFixturesArtistQueryVariables = {
    id: string;
};
export type MockRelayRendererFixturesArtistQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"MockRelayRendererFixtures_artist">;
    } | null;
};
export type MockRelayRendererFixturesArtistQuery = {
    readonly response: MockRelayRendererFixturesArtistQueryResponse;
    readonly variables: MockRelayRendererFixturesArtistQueryVariables;
};



/*
query MockRelayRendererFixturesArtistQuery(
  $id: String!
) {
  artist(id: $id) {
    ...MockRelayRendererFixtures_artist
    id
  }
}

fragment MockRelayRendererFixtures_artist on Artist {
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MockRelayRendererFixturesArtistQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MockRelayRendererFixtures_artist"
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
    "name": "MockRelayRendererFixturesArtistQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
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
    "id": "cbf4686647f004d150e5f1a608cbe861",
    "metadata": {},
    "name": "MockRelayRendererFixturesArtistQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'aabded82722f7ed4c4f873a3d0b315be';
export default node;
