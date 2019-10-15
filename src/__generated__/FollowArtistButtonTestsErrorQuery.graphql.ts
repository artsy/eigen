/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FollowArtistButton_artist$ref } from "./FollowArtistButton_artist.graphql";
export type FollowArtistButtonTestsErrorQueryVariables = {};
export type FollowArtistButtonTestsErrorQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FollowArtistButton_artist$ref;
    } | null;
};
export type FollowArtistButtonTestsErrorQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly is_followed: boolean | null;
    }) | null;
};
export type FollowArtistButtonTestsErrorQuery = {
    readonly response: FollowArtistButtonTestsErrorQueryResponse;
    readonly variables: FollowArtistButtonTestsErrorQueryVariables;
    readonly rawResponse: FollowArtistButtonTestsErrorQueryRawResponse;
};



/*
query FollowArtistButtonTestsErrorQuery {
  artist(id: "artistID") {
    ...FollowArtistButton_artist
    id
  }
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed: isFollowed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artistID"
  }
];
return {
  "kind": "Request",
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
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FollowArtistButton_artist",
            "args": null
          }
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
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
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
            "kind": "ScalarField",
            "alias": "is_followed",
            "name": "isFollowed",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FollowArtistButtonTestsErrorQuery",
    "id": "1b7cfa5b786e32f0faccd54efa1c07bd",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '22243b83ad90d479f77e6a5683cc90dc';
export default node;
