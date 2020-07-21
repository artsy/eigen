/* tslint:disable */
/* eslint-disable */
/* @relayHash afdc8c803d9fa9ef550b11dd0dd3ee50 */

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
    "kind": "LocalArgument",
    "name": "input",
    "type": "FollowArtistInput!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "isFollowed",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesMetaFollowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followArtist",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesMetaFollowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followArtist",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtistSeriesMetaFollowMutation",
    "id": "628973ab7893ef6c168d9a16152051e6",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b3e0958b2c8727600b7c82ef0c74630f';
export default node;
