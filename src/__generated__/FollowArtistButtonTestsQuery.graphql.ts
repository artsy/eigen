/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fd193e93b0118d71e98014c6426956a7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistButtonTestsQueryVariables = {};
export type FollowArtistButtonTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
    } | null;
};
export type FollowArtistButtonTestsQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly is_followed: boolean | null;
    }) | null;
};
export type FollowArtistButtonTestsQuery = {
    readonly response: FollowArtistButtonTestsQueryResponse;
    readonly variables: FollowArtistButtonTestsQueryVariables;
    readonly rawResponse: FollowArtistButtonTestsQueryRawResponse;
};



/*
query FollowArtistButtonTestsQuery {
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FollowArtistButtonTestsQuery",
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
            "name": "FollowArtistButton_artist"
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
    "name": "FollowArtistButtonTestsQuery",
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
    "id": "fd193e93b0118d71e98014c6426956a7",
    "metadata": {},
    "name": "FollowArtistButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b8a4919d4f5e1e9039e03985edeccbad';
export default node;
