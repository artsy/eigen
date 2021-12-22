/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2429a78fffc06f3861cfecb20d89ee35 */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null | undefined;
    unfollow?: boolean | null | undefined;
};
export type FollowArtistLinkMutationVariables = {
    input: FollowArtistInput;
};
export type FollowArtistLinkMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type FollowArtistLinkMutation = {
    readonly response: FollowArtistLinkMutationResponse;
    readonly variables: FollowArtistLinkMutationVariables;
};



/*
mutation FollowArtistLinkMutation(
  $input: FollowArtistInput!
) {
  followArtist(input: $input) {
    artist {
      id
      is_followed: isFollowed
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
            "alias": "is_followed",
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
    "name": "FollowArtistLinkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FollowArtistLinkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "2429a78fffc06f3861cfecb20d89ee35",
    "metadata": {},
    "name": "FollowArtistLinkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'a6ba5891075f491cd96bb83dfff07883';
export default node;
