/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ab85a2eccf1a38b11df8fe6fa1f4f700 */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null;
    unfollow?: boolean | null;
};
export type ArtistHeaderFollowArtistMutationVariables = {
    input: FollowArtistInput;
};
export type ArtistHeaderFollowArtistMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type ArtistHeaderFollowArtistMutation = {
    readonly response: ArtistHeaderFollowArtistMutationResponse;
    readonly variables: ArtistHeaderFollowArtistMutationVariables;
};



/*
mutation ArtistHeaderFollowArtistMutation(
  $input: FollowArtistInput!
) {
  followArtist(input: $input) {
    artist {
      id
      isFollowed
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowArtistPayload",
    "kind": "LinkedField",
    "name": "followArtist",
    "plural": false,
    "selections": [
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
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistHeaderFollowArtistMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistHeaderFollowArtistMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "ab85a2eccf1a38b11df8fe6fa1f4f700",
    "metadata": {},
    "name": "ArtistHeaderFollowArtistMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '3ef30681f32ef143c1d431a5c309ceef';
export default node;
