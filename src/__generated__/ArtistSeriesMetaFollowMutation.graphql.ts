/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 628973ab7893ef6c168d9a16152051e6 */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    artistID: string;
    clientMutationId?: string | null;
    unfollow?: boolean | null;
};
export type ArtistSeriesMetaFollowMutationVariables = {
    input: FollowArtistInput;
};
export type ArtistSeriesMetaFollowMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type ArtistSeriesMetaFollowMutation = {
    readonly response: ArtistSeriesMetaFollowMutationResponse;
    readonly variables: ArtistSeriesMetaFollowMutationVariables;
};



/*
mutation ArtistSeriesMetaFollowMutation(
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
    "name": "ArtistSeriesMetaFollowMutation",
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
    "name": "ArtistSeriesMetaFollowMutation",
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
    "id": "628973ab7893ef6c168d9a16152051e6",
    "metadata": {},
    "name": "ArtistSeriesMetaFollowMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'b3e0958b2c8727600b7c82ef0c74630f';
export default node;
