/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowArtistInput = {
    readonly artistID: string;
    readonly unfollow?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type ArtistRailFollowMutationVariables = {
    input: FollowArtistInput;
    excludeArtistIDs: ReadonlyArray<string | null>;
};
export type ArtistRailFollowMutationResponse = {
    readonly followArtist: {
        readonly artist: {
            readonly related: {
                readonly suggestedConnection: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly id: string;
                            readonly slug: string;
                            readonly internalID: string;
                            readonly href: string | null;
                            readonly name: string | null;
                            readonly formattedArtworksCount: string | null;
                            readonly formattedNationalityAndBirthday: string | null;
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
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
  $excludeArtistIDs: [String]!
) {
  followArtist(input: $input) {
    artist {
      related {
        suggestedConnection(first: 1, excludeArtistIDs: $excludeArtistIDs, excludeFollowedArtists: true, excludeArtistsWithoutForsaleArtworks: true) {
          edges {
            node {
              id
              slug
              internalID
              href
              name
              formattedArtworksCount
              formattedNationalityAndBirthday
              image {
                url(version: "large")
              }
            }
          }
        }
      }
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
  },
  {
    "kind": "LocalArgument",
    "name": "excludeArtistIDs",
    "type": "[String]!",
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "related",
  "storageKey": null,
  "args": null,
  "concreteType": "ArtistRelatedData",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "suggestedConnection",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "excludeArtistIDs",
          "variableName": "excludeArtistIDs"
        },
        {
          "kind": "Literal",
          "name": "excludeArtistsWithoutForsaleArtworks",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "excludeFollowedArtists",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                (v2/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "href",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "formattedArtworksCount",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "formattedNationalityAndBirthday",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": "large"
                        }
                      ],
                      "storageKey": "url(version:\"large\")"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistRailFollowMutation",
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
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistRailFollowMutation",
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
              (v3/*: any*/),
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtistRailFollowMutation",
    "id": "35619b0bc76edbfd09c0e8f17d2a6e17",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b92f45f01f6a5c6a19621cd608aa97d9';
export default node;
