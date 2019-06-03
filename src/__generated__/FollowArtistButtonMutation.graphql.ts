/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    readonly artist_id?: string | null;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type FollowArtistButtonMutationVariables = {
    readonly input: FollowArtistInput;
};
export type FollowArtistButtonMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly id: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type FollowArtistButtonMutation = {
    readonly response: FollowArtistButtonMutationResponse;
    readonly variables: FollowArtistButtonMutationVariables;
};



/*
mutation FollowArtistButtonMutation(
  $input: FollowArtistInput!
) {
  followArtist(input: $input) {
    artist {
      id
      is_followed
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
            "name": "is_followed",
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
    "name": "FollowArtistButtonMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FollowArtistButtonMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "FollowArtistButtonMutation",
    "id": "0e1932218dd1ee38e2f1390ecd3c9908",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a53a243d72f2e800251c2bce22970818';
export default node;
