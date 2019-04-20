/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MockRelayRendererFixtures_artwork$ref } from "./MockRelayRendererFixtures_artwork.graphql";
export type MockRelayRendererFixturesQueryVariables = {};
export type MockRelayRendererFixturesQueryResponse = {
    readonly artwork: ({
        readonly " $fragmentRefs": MockRelayRendererFixtures_artwork$ref;
    }) | null;
};
export type MockRelayRendererFixturesQuery = {
    readonly response: MockRelayRendererFixturesQueryResponse;
    readonly variables: MockRelayRendererFixturesQueryVariables;
};



/*
query MockRelayRendererFixturesQuery {
  artwork(id: "mona-lisa") {
    ...MockRelayRendererFixtures_artwork
  }
}

fragment MockRelayRendererFixtures_artwork on Artwork {
  image {
    url
  }
  artist {
    gravityID
  }
  ...MockRelayRendererFixtures_artworkMetadata
}

fragment MockRelayRendererFixtures_artworkMetadata on Artwork {
  title
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "mona-lisa",
    "type": "String!"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MockRelayRendererFixturesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"mona-lisa\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MockRelayRendererFixtures_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MockRelayRendererFixturesQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"mona-lisa\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "gravityID",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MockRelayRendererFixturesQuery",
    "id": "814458999981388a8402adebf4982530",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '814458999981388a8402adebf4982530';
export default node;
