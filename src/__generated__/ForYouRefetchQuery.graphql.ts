/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ForYouRefetchQueryVariables = {};
export type ForYouRefetchQueryResponse = {
    readonly forYou: {
        readonly " $fragmentRefs": FragmentRefs<"ForYou_forYou">;
    } | null;
};
export type ForYouRefetchQuery = {
    readonly response: ForYouRefetchQueryResponse;
    readonly variables: ForYouRefetchQueryVariables;
};



/*
query ForYouRefetchQuery {
  forYou: homePage {
    ...ForYou_forYou
  }
}

fragment ForYou_forYou on HomePage {
  artwork_modules: artworkModules(maxRails: -1, maxFollowedGeneRails: -1, order: [ACTIVE_BIDS, RECENTLY_VIEWED_WORKS, RECOMMENDED_WORKS, FOLLOWED_ARTISTS, RELATED_ARTISTS, FOLLOWED_GALLERIES, SAVED_WORKS, LIVE_AUCTIONS, CURRENT_FAIRS, FOLLOWED_GENES], exclude: [FOLLOWED_ARTISTS, GENERIC_GENES]) {
    id
    ...ArtworkRail_rail
  }
  artist_modules: artistModules {
    id
    ...ArtistRail_rail
  }
  fairs_module: fairsModule {
    ...FairsRail_fairs_module
  }
}

fragment ArtworkRail_rail on HomePageArtworkModule {
  title
  key
  results {
    href
    image {
      imageURL
    }
    id
  }
  context {
    __typename
    ... on HomePageRelatedArtistArtworkModule {
      __typename
      artist {
        slug
        internalID
        href
        id
      }
      basedOn {
        name
        id
      }
    }
    ... on HomePageFollowedArtistArtworkModule {
      artist {
        href
        id
      }
    }
    ... on Fair {
      href
    }
    ... on Gene {
      href
    }
    ... on Sale {
      href
    }
    ... on Node {
      id
    }
  }
}

fragment ArtistRail_rail on HomePageArtistModule {
  id
  key
  results {
    id
    internalID
    ...ArtistCard_artist
  }
}

fragment FairsRail_fairs_module on HomePageFairsModule {
  results {
    id
    slug
    profile {
      slug
      id
    }
    name
    exhibitionPeriod
    image {
      url(version: "large")
    }
    followedArtistArtworks: filterArtworksConnection(first: 2, includeArtworksByFollowedArtists: true) {
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
      id
    }
    otherArtworks: filterArtworksConnection(first: 2) {
      edges {
        node {
          image {
            url(version: "large")
          }
          id
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
          url(version: "large")
        }
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "key",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = [
  (v2/*: any*/)
],
v8 = {
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
},
v9 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "node",
    "storageKey": null,
    "args": null,
    "concreteType": "Artwork",
    "plural": false,
    "selections": [
      (v8/*: any*/),
      (v0/*: any*/)
    ]
  }
],
v10 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
},
v11 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "FilterArtworksEdge",
    "plural": true,
    "selections": (v9/*: any*/)
  },
  (v0/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ForYouRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "forYou",
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ForYou_forYou",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ForYouRefetchQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "forYou",
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "artwork_modules",
            "name": "artworkModules",
            "storageKey": "artworkModules(exclude:[\"FOLLOWED_ARTISTS\",\"GENERIC_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"RECENTLY_VIEWED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\"])",
            "args": [
              {
                "kind": "Literal",
                "name": "exclude",
                "value": [
                  "FOLLOWED_ARTISTS",
                  "GENERIC_GENES"
                ]
              },
              {
                "kind": "Literal",
                "name": "maxFollowedGeneRails",
                "value": -1
              },
              {
                "kind": "Literal",
                "name": "maxRails",
                "value": -1
              },
              {
                "kind": "Literal",
                "name": "order",
                "value": [
                  "ACTIVE_BIDS",
                  "RECENTLY_VIEWED_WORKS",
                  "RECOMMENDED_WORKS",
                  "FOLLOWED_ARTISTS",
                  "RELATED_ARTISTS",
                  "FOLLOWED_GALLERIES",
                  "SAVED_WORKS",
                  "LIVE_AUCTIONS",
                  "CURRENT_FAIRS",
                  "FOLLOWED_GENES"
                ]
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Artwork",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
                        "name": "imageURL",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  (v0/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "context",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v0/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageRelatedArtistArtworkModule",
                    "selections": [
                      (v3/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artist",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v2/*: any*/),
                          (v0/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "basedOn",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v0/*: any*/)
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageFollowedArtistArtworkModule",
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
                          (v0/*: any*/)
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Fair",
                    "selections": (v7/*: any*/)
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Gene",
                    "selections": (v7/*: any*/)
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Sale",
                    "selections": (v7/*: any*/)
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "artist_modules",
            "name": "artistModules",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageArtistModule",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v5/*: any*/),
                  (v4/*: any*/),
                  (v2/*: any*/),
                  (v6/*: any*/),
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
                    "selections": [
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
                    ]
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
                        "selections": (v9/*: any*/)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "fairs_module",
            "name": "fairsModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageFairsModule",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Fair",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v4/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v0/*: any*/)
                    ]
                  },
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "exhibitionPeriod",
                    "args": null,
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "followedArtistArtworks",
                    "name": "filterArtworksConnection",
                    "storageKey": "filterArtworksConnection(first:2,includeArtworksByFollowedArtists:true)",
                    "args": [
                      (v10/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "includeArtworksByFollowedArtists",
                        "value": true
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": (v11/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "otherArtworks",
                    "name": "filterArtworksConnection",
                    "storageKey": "filterArtworksConnection(first:2)",
                    "args": [
                      (v10/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": (v11/*: any*/)
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ForYouRefetchQuery",
    "id": "a20d025f689f651d4dd80e2d49b49880",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c03b254df97a32107443556fae87e4c6';
export default node;
