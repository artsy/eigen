/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f2a76e9664b932e0ece8e2815656f66e */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null;
    unfollow?: boolean | null;
};
export type ArtistRailFollowMutationVariables = {
    input: FollowArtistInput;
};
export type ArtistRailFollowMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type ArtistRailFollowMutation = {
    readonly response: ArtistRailFollowMutationResponse;
    readonly variables: ArtistRailFollowMutationVariables;
};



/*
mutation ArtistRailFollowMutation(
  $input: FollowArtistInput!
) {
  followArtist(input: $input) {
    artist {
      isFollowed
      id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistRailFollowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistRailFollowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "f2a76e9664b932e0ece8e2815656f66e",
    "metadata": {},
    "name": "ArtistRailFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c5a0ce2df50e88db1066d6406b7d7a08';
export default node;
