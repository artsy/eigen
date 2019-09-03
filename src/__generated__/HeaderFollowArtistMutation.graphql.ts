/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    readonly artistID: string;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type HeaderFollowArtistMutationVariables = {
    readonly input: FollowArtistInput;
};
export type HeaderFollowArtistMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type HeaderFollowArtistMutation = {
    readonly response: HeaderFollowArtistMutationResponse;
    readonly variables: HeaderFollowArtistMutationVariables;
};



/*
mutation HeaderFollowArtistMutation(
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
    "name": "HeaderFollowArtistMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HeaderFollowArtistMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "HeaderFollowArtistMutation",
    "id": "94e40972daf378665e3b505de12b0b43",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ff78930855c1e839ab6a5c31afb53947';
export default node;
