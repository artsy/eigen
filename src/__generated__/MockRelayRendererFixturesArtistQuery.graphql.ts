/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MockRelayRendererFixtures_artist$ref } from "./MockRelayRendererFixtures_artist.graphql";
export type MockRelayRendererFixturesArtistQueryVariables = {
    readonly id: string;
};
export type MockRelayRendererFixturesArtistQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": MockRelayRendererFixtures_artist$ref;
    }) | null;
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
    __id: id
  }
}

fragment MockRelayRendererFixtures_artist on Artist {
  name
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MockRelayRendererFixturesArtistQuery",
  "id": null,
  "text": "query MockRelayRendererFixturesArtistQuery(\n  $id: String!\n) {\n  artist(id: $id) {\n    ...MockRelayRendererFixtures_artist\n    __id: id\n  }\n}\n\nfragment MockRelayRendererFixtures_artist on Artist {\n  name\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MockRelayRendererFixturesArtistQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MockRelayRendererFixtures_artist",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MockRelayRendererFixturesArtistQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'aabded82722f7ed4c4f873a3d0b315be';
export default node;
