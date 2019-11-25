/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    readonly artistID: string;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "FollowArtistInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "followArtist",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowArtistPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": null,
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
            "name": "isFollowed",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistHeaderFollowArtistMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistHeaderFollowArtistMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtistHeaderFollowArtistMutation",
    "id": "ab85a2eccf1a38b11df8fe6fa1f4f700",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3ef30681f32ef143c1d431a5c309ceef';
export default node;
