/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fb272ba544200e2e2beef09e1fe0a2f3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MockRelayRendererFixturesBadQueryVariables = {};
export type MockRelayRendererFixturesBadQueryResponse = {
    readonly something_that_is_not_expected: {
        readonly " $fragmentRefs": FragmentRefs<"MockRelayRendererFixtures_artwork">;
    } | null;
};
export type MockRelayRendererFixturesBadQuery = {
    readonly response: MockRelayRendererFixturesBadQueryResponse;
    readonly variables: MockRelayRendererFixturesBadQueryVariables;
};



/*
query MockRelayRendererFixturesBadQuery {
  something_that_is_not_expected: artwork(id: "mona-lisa") {
    ...MockRelayRendererFixtures_artwork
    id
  }
}

fragment MockRelayRendererFixtures_artwork on Artwork {
  image {
    url
  }
  artist {
    slug
    id
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
    "value": "mona-lisa"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MockRelayRendererFixturesBadQuery",
    "selections": [
      {
        "alias": "something_that_is_not_expected",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MockRelayRendererFixtures_artwork"
          }
        ],
        "storageKey": "artwork(id:\"mona-lisa\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MockRelayRendererFixturesBadQuery",
    "selections": [
      {
        "alias": "something_that_is_not_expected",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "artwork(id:\"mona-lisa\")"
      }
    ]
  },
  "params": {
    "id": "fb272ba544200e2e2beef09e1fe0a2f3",
    "metadata": {},
    "name": "MockRelayRendererFixturesBadQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ab040493eb68f4cb47eb0f983cd4fdb2';
export default node;
