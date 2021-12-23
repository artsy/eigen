/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 80d7119123ff0ea818f0cd5794ec7384 */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null | undefined;
    unfollow?: boolean | null | undefined;
};
export type ArtistRailFollowMutationVariables = {
    input: FollowArtistInput;
};
export type ArtistRailFollowMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
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
    "name": "ArtistRailFollowMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistRailFollowMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "80d7119123ff0ea818f0cd5794ec7384",
    "metadata": {},
    "name": "ArtistRailFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '1ad05743d14a15b2d3cb4e01b44414c7';
export default node;
