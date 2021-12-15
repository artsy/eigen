/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4977eb4752d7fcf8cf11ce5fa90f5cb3 */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null;
    unfollow?: boolean | null;
};
export type RecommendedArtistsRailFollowMutationVariables = {
    input: FollowArtistInput;
};
export type RecommendedArtistsRailFollowMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type RecommendedArtistsRailFollowMutation = {
    readonly response: RecommendedArtistsRailFollowMutationResponse;
    readonly variables: RecommendedArtistsRailFollowMutationVariables;
};



/*
mutation RecommendedArtistsRailFollowMutation(
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
    "name": "RecommendedArtistsRailFollowMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecommendedArtistsRailFollowMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "4977eb4752d7fcf8cf11ce5fa90f5cb3",
    "metadata": {},
    "name": "RecommendedArtistsRailFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '054a8b1ef7f810861f694bb25111efc8';
export default node;
