/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FollowArtistButton_artist$ref } from "./FollowArtistButton_artist.graphql";
export type FollowArtistButtonTestsQueryVariables = {};
export type FollowArtistButtonTestsQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": FollowArtistButton_artist$ref;
    }) | null;
};
export type FollowArtistButtonTestsQuery = {
    readonly response: FollowArtistButtonTestsQueryResponse;
    readonly variables: FollowArtistButtonTestsQueryVariables;
};



/*
query FollowArtistButtonTestsQuery {
  artist(id: "artistID") {
    ...FollowArtistButton_artist
    __id
  }
}

fragment FollowArtistButton_artist on Artist {
  __id
  id
  _id
  is_followed
  counts {
    follows
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artistID",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FollowArtistButtonTestsQuery",
  "id": "fd563075e0fe29a5b87123493c0424fd",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FollowArtistButtonTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"artistID\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FollowArtistButton_artist",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FollowArtistButtonTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"artistID\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_followed",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "follows",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '3acf00c64be9e5d7ce2cbe1e7ef96619';
export default node;
