/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash eed586db0857ad78b2ab6475e80bc8e2 */

import { ConcreteRequest } from "relay-runtime";
export type ArtistRailNewSuggestionQueryVariables = {
    basedOnArtistId: string;
    excludeArtistIDs: Array<string>;
};
export type ArtistRailNewSuggestionQueryResponse = {
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
                        readonly formattedNationalityAndBirthday: string | null;
                        readonly avatar: {
                            readonly url: string | null;
                        } | null;
                        readonly basedOn: {
                            readonly name: string | null;
                        } | null;
                        readonly isFollowed: boolean | null;
                        readonly artworksConnection: {
                            readonly edges: ReadonlyArray<{
                                readonly node: {
                                    readonly image: {
                                        readonly url: string | null;
                                    } | null;
                                } | null;
                            } | null> | null;
                        } | null;
                    } | null;
                } | null> | null;
            } | null;
        } | null;
    } | null;
};
export type ArtistRailNewSuggestionQuery = {
    readonly response: ArtistRailNewSuggestionQueryResponse;
    readonly variables: ArtistRailNewSuggestionQueryVariables;
};



/*
query ArtistRailNewSuggestionQuery(
  $basedOnArtistId: String!
  $excludeArtistIDs: [String!]!
) {
  artist(id: $basedOnArtistId) {
    related {
      suggestedConnection(excludeArtistIDs: $excludeArtistIDs, first: 1, excludeFollowedArtists: true, excludeArtistsWithoutForsaleArtworks: true) {
        edges {
          node {
            id
            slug
            internalID
            href
            name
            formattedNationalityAndBirthday
            avatar: image {
              url(version: "small")
            }
            basedOn {
              name
              id
            }
            isFollowed
            artworksConnection(first: 3) {
              edges {
                node {
                  image {
                    url(version: "large")
                  }
                  id
                }
              }
            }
          }
        }
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "basedOnArtistId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "excludeArtistIDs"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "basedOnArtistId"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formattedNationalityAndBirthday",
  "storageKey": null
},
v9 = {
  "alias": "avatar",
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "small"
        }
      ],
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"small\")"
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "large"
        }
      ],
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"large\")"
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistRailNewSuggestionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "kind": "LinkedField",
            "name": "related",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v2/*: any*/),
                "concreteType": "ArtistConnection",
                "kind": "LinkedField",
                "name": "suggestedConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "basedOn",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": (v11/*: any*/),
                            "concreteType": "ArtworkConnection",
                            "kind": "LinkedField",
                            "name": "artworksConnection",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ArtworkEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Artwork",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v12/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "artworksConnection(first:3)"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistRailNewSuggestionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "kind": "LinkedField",
            "name": "related",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v2/*: any*/),
                "concreteType": "ArtistConnection",
                "kind": "LinkedField",
                "name": "suggestedConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "basedOn",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": (v11/*: any*/),
                            "concreteType": "ArtworkConnection",
                            "kind": "LinkedField",
                            "name": "artworksConnection",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ArtworkEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Artwork",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v12/*: any*/),
                                      (v3/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "artworksConnection(first:3)"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "eed586db0857ad78b2ab6475e80bc8e2",
    "metadata": {},
    "name": "ArtistRailNewSuggestionQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '83922a59b5b7a3bc04695b4ea9c0b82a';
export default node;
