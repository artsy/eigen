/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
                            readonly " $fragmentRefs": FragmentRefs<"ArtistCard_artist">;
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
              ...ArtistCard_artist
              id
            }
          }
        }
      }
      id
    }
  }
}

fragment ArtistCard_artist on Artist {
  id
  slug
  internalID
  href
  name
  formattedNationalityAndBirthday
  avatar: image {
    url(version: "small")
  }
  artworksConnection(first: 3) {
    edges {
      node {
        image {
          url(version: "small")
        }
        id
      }
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
v2 = [
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "small"
      }
    ],
    "storageKey": "url(version:\"small\")"
  }
];
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
              {
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
                    "args": (v2/*: any*/),
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
                              {
                                "kind": "FragmentSpread",
                                "name": "ArtistCard_artist",
                                "args": null
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
              {
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
                    "args": (v2/*: any*/),
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
                              (v3/*: any*/),
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
                                "name": "formattedNationalityAndBirthday",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": "avatar",
                                "name": "image",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Image",
                                "plural": false,
                                "selections": (v4/*: any*/)
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "artworksConnection",
                                "storageKey": "artworksConnection(first:3)",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "first",
                                    "value": 3
                                  }
                                ],
                                "concreteType": "ArtworkConnection",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "edges",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "ArtworkEdge",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "node",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "Artwork",
                                        "plural": false,
                                        "selections": [
                                          {
                                            "kind": "LinkedField",
                                            "alias": null,
                                            "name": "image",
                                            "storageKey": null,
                                            "args": null,
                                            "concreteType": "Image",
                                            "plural": false,
                                            "selections": (v4/*: any*/)
                                          },
                                          (v3/*: any*/)
                                        ]
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
                  }
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtistRailFollowMutation",
    "id": "5e084c1ac7e4165288ff96c55075d5e5",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6d18e6f82ca2fcb497dd430f45c3f32e';
export default node;
