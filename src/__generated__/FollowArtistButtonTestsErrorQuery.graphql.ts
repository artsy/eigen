/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FollowArtistButton_artist$ref } from "./FollowArtistButton_artist.graphql";
export type FollowArtistButtonTestsErrorQueryVariables = {};
export type FollowArtistButtonTestsErrorQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": FollowArtistButton_artist$ref;
    }) | null;
};
export type FollowArtistButtonTestsErrorQuery = {
    readonly response: FollowArtistButtonTestsErrorQueryResponse;
    readonly variables: FollowArtistButtonTestsErrorQueryVariables;
};



/*
query FollowArtistButtonTestsErrorQuery {
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
  "name": "FollowArtistButtonTestsErrorQuery",
  "id": "bdb87c6a4854d20604243cd2734830e4",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FollowArtistButtonTestsErrorQuery",
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
    "name": "FollowArtistButtonTestsErrorQuery",
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
(node as any).hash = '97921de2506586348cf2e12ac6f5a01f';
export default node;
