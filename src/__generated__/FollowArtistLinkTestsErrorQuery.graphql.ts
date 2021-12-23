/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4a7092df43033e624e44a96185a72ddc */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistLinkTestsErrorQueryVariables = {};
export type FollowArtistLinkTestsErrorQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"FollowArtistLink_artist">;
    } | null;
};
export type FollowArtistLinkTestsErrorQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly is_followed: boolean | null;
    }) | null;
};
export type FollowArtistLinkTestsErrorQuery = {
    readonly response: FollowArtistLinkTestsErrorQueryResponse;
    readonly variables: FollowArtistLinkTestsErrorQueryVariables;
    readonly rawResponse: FollowArtistLinkTestsErrorQueryRawResponse;
};



/*
query FollowArtistLinkTestsErrorQuery {
  artist(id: "artistID") {
    ...FollowArtistLink_artist
    id
  }
}

fragment FollowArtistLink_artist on Artist {
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FollowArtistLinkTestsErrorQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FollowArtistLink_artist"
          }
        ],
        "storageKey": "artist(id:\"artistID\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FollowArtistLinkTestsErrorQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": "is_followed",
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          }
        ],
        "storageKey": "artist(id:\"artistID\")"
      }
    ]
  },
  "params": {
    "id": "4a7092df43033e624e44a96185a72ddc",
    "metadata": {},
    "name": "FollowArtistLinkTestsErrorQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'dcc02c2ec5e8b1b6bb8faa6665ec4cee';
export default node;
