/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MockRelayRendererFixtures_artwork$ref } from "./MockRelayRendererFixtures_artwork.graphql";
export type MockRelayRendererFixturesBadQueryVariables = {};
export type MockRelayRendererFixturesBadQueryResponse = {
    readonly something_that_is_not_expected: ({
        readonly " $fragmentRefs": MockRelayRendererFixtures_artwork$ref;
    }) | null;
};
export type MockRelayRendererFixturesBadQuery = {
    readonly response: MockRelayRendererFixturesBadQueryResponse;
    readonly variables: MockRelayRendererFixturesBadQueryVariables;
};



/*
query MockRelayRendererFixturesBadQuery {
  something_that_is_not_expected: artwork(id: "mona-lisa") {
    ...MockRelayRendererFixtures_artwork
    __id: id
  }
}

fragment MockRelayRendererFixtures_artwork on Artwork {
  image {
    url
  }
  artist {
    gravityID
    __id: id
  }
  ...MockRelayRendererFixtures_artworkMetadata
  __id: id
}

fragment MockRelayRendererFixtures_artworkMetadata on Artwork {
  title
  __id: id
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
],
v1 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MockRelayRendererFixturesBadQuery",
  "id": null,
  "text": "query MockRelayRendererFixturesBadQuery {\n  something_that_is_not_expected: artwork(id: \"mona-lisa\") {\n    ...MockRelayRendererFixtures_artwork\n    __id: id\n  }\n}\n\nfragment MockRelayRendererFixtures_artwork on Artwork {\n  image {\n    url\n  }\n  artist {\n    gravityID\n    __id: id\n  }\n  ...MockRelayRendererFixtures_artworkMetadata\n  __id: id\n}\n\nfragment MockRelayRendererFixtures_artworkMetadata on Artwork {\n  title\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MockRelayRendererFixturesBadQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "something_that_is_not_expected",
        "name": "artwork",
        "storageKey": "artwork(id:\"mona-lisa\")",
        "args": v0,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MockRelayRendererFixtures_artwork",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MockRelayRendererFixturesBadQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "something_that_is_not_expected",
        "name": "artwork",
        "storageKey": "artwork(id:\"mona-lisa\")",
        "args": v0,
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
              },
              v1
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'ab040493eb68f4cb47eb0f983cd4fdb2';
export default node;
