/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersForYouQueryVariables = {
};
export type QueryRenderersForYouQueryResponse = {
    readonly forYou: ({
    }) | null;
};



/*
query QueryRenderersForYouQuery {
  forYou: home_page {
    ...ForYou_forYou
  }
}

fragment ForYou_forYou on HomePage {
  artwork_modules(max_rails: -1, max_followed_gene_rails: -1, order: [ACTIVE_BIDS, RECOMMENDED_WORKS, FOLLOWED_ARTISTS, RELATED_ARTISTS, FOLLOWED_GALLERIES, SAVED_WORKS, LIVE_AUCTIONS, CURRENT_FAIRS, FOLLOWED_GENES, GENERIC_GENES], exclude: [FOLLOWED_ARTISTS]) {
    __id
    ...ArtworkCarousel_rail
  }
  artist_modules {
    __id
    ...ArtistRail_rail
  }
  fairs_module {
    ...FairsRail_fairs_module
  }
}

fragment ArtworkCarousel_rail on HomePageArtworkModule {
  ...ArtworkCarouselHeader_rail
  __id
  key
  params {
    medium
    price_range
    id
  }
  context {
    __typename
    ... on HomePageModuleContextFollowedArtist {
      artist {
        href
        __id
      }
    }
    ... on HomePageModuleContextRelatedArtist {
      artist {
        href
        __id
      }
    }
    ... on HomePageModuleContextFair {
      href
      __id
    }
    ... on HomePageModuleContextGene {
      href
    }
    ... on HomePageModuleContextSale {
      href
    }
    ... on Node {
      __id
    }
  }
}

fragment ArtistRail_rail on HomePageArtistModule {
  __id
  key
}

fragment FairsRail_fairs_module on HomePageFairsModule {
  results {
    id
    name
    profile {
      href
      __id
    }
    mobile_image {
      id
      url
    }
    __id
  }
}

fragment ArtworkCarouselHeader_rail on HomePageArtworkModule {
  title
  key
  followedArtistContext: context {
    __typename
    ... on HomePageModuleContextFollowedArtist {
      artist {
        _id
        id
        __id
      }
    }
    ... on Node {
      __id
    }
    ... on HomePageModuleContextFair {
      __id
    }
  }
  relatedArtistContext: context {
    __typename
    ... on HomePageModuleContextRelatedArtist {
      artist {
        _id
        id
        __id
      }
      based_on {
        name
        __id
      }
    }
    ... on Node {
      __id
    }
    ... on HomePageModuleContextFair {
      __id
    }
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
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
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    v3,
    v0
  ],
  "idField": "__id"
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = [
  v6
],
v8 = [
  v6,
  v0
],
v9 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artist",
    "storageKey": null,
    "args": null,
    "concreteType": "Artist",
    "plural": false,
    "selections": v8,
    "idField": "__id"
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersForYouQuery",
  "id": null,
  "text": "query QueryRenderersForYouQuery {\n  forYou: home_page {\n    ...ForYou_forYou\n  }\n}\n\nfragment ForYou_forYou on HomePage {\n  artwork_modules(max_rails: -1, max_followed_gene_rails: -1, order: [ACTIVE_BIDS, RECOMMENDED_WORKS, FOLLOWED_ARTISTS, RELATED_ARTISTS, FOLLOWED_GALLERIES, SAVED_WORKS, LIVE_AUCTIONS, CURRENT_FAIRS, FOLLOWED_GENES, GENERIC_GENES], exclude: [FOLLOWED_ARTISTS]) {\n    __id\n    ...ArtworkCarousel_rail\n  }\n  artist_modules {\n    __id\n    ...ArtistRail_rail\n  }\n  fairs_module {\n    ...FairsRail_fairs_module\n  }\n}\n\nfragment ArtworkCarousel_rail on HomePageArtworkModule {\n  ...ArtworkCarouselHeader_rail\n  __id\n  key\n  params {\n    medium\n    price_range\n    id\n  }\n  context {\n    __typename\n    ... on HomePageModuleContextFollowedArtist {\n      artist {\n        href\n        __id\n      }\n    }\n    ... on HomePageModuleContextRelatedArtist {\n      artist {\n        href\n        __id\n      }\n    }\n    ... on HomePageModuleContextFair {\n      href\n      __id\n    }\n    ... on HomePageModuleContextGene {\n      href\n    }\n    ... on HomePageModuleContextSale {\n      href\n    }\n    ... on Node {\n      __id\n    }\n  }\n}\n\nfragment ArtistRail_rail on HomePageArtistModule {\n  __id\n  key\n}\n\nfragment FairsRail_fairs_module on HomePageFairsModule {\n  results {\n    id\n    name\n    profile {\n      href\n      __id\n    }\n    mobile_image {\n      id\n      url\n    }\n    __id\n  }\n}\n\nfragment ArtworkCarouselHeader_rail on HomePageArtworkModule {\n  title\n  key\n  followedArtistContext: context {\n    __typename\n    ... on HomePageModuleContextFollowedArtist {\n      artist {\n        _id\n        id\n        __id\n      }\n    }\n    ... on Node {\n      __id\n    }\n    ... on HomePageModuleContextFair {\n      __id\n    }\n  }\n  relatedArtistContext: context {\n    __typename\n    ... on HomePageModuleContextRelatedArtist {\n      artist {\n        _id\n        id\n        __id\n      }\n      based_on {\n        name\n        __id\n      }\n    }\n    ... on Node {\n      __id\n    }\n    ... on HomePageModuleContextFair {\n      __id\n    }\n  }\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersForYouQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "forYou",
        "name": "home_page",
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
    "name": "QueryRenderersForYouQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "forYou",
        "name": "home_page",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artwork_modules",
            "storageKey": "artwork_modules(exclude:[\"FOLLOWED_ARTISTS\"],max_followed_gene_rails:-1,max_rails:-1,order:[\"ACTIVE_BIDS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\",\"GENERIC_GENES\"])",
            "args": [
              {
                "kind": "Literal",
                "name": "exclude",
                "value": [
                  "FOLLOWED_ARTISTS"
                ],
                "type": "[HomePageArtworkModuleTypes]"
              },
              {
                "kind": "Literal",
                "name": "max_followed_gene_rails",
                "value": -1,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "max_rails",
                "value": -1,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "order",
                "value": [
                  "ACTIVE_BIDS",
                  "RECOMMENDED_WORKS",
                  "FOLLOWED_ARTISTS",
                  "RELATED_ARTISTS",
                  "FOLLOWED_GALLERIES",
                  "SAVED_WORKS",
                  "LIVE_AUCTIONS",
                  "CURRENT_FAIRS",
                  "FOLLOWED_GENES",
                  "GENERIC_GENES"
                ],
                "type": "[HomePageArtworkModuleTypes]"
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "plural": true,
            "selections": [
              v0,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
                "args": null,
                "storageKey": null
              },
              v1,
              {
                "kind": "LinkedField",
                "alias": "followedArtistContext",
                "name": "context",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  v2,
                  v0,
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFollowedArtist",
                    "selections": [
                      v4
                    ]
                  }
                ],
                "idField": "__id"
              },
              {
                "kind": "LinkedField",
                "alias": "relatedArtistContext",
                "name": "context",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  v2,
                  v0,
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextRelatedArtist",
                    "selections": [
                      v4,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "based_on",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          v5,
                          v0
                        ],
                        "idField": "__id"
                      }
                    ]
                  }
                ],
                "idField": "__id"
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "params",
                "storageKey": null,
                "args": null,
                "concreteType": "HomePageModulesParams",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "medium",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "price_range",
                    "args": null,
                    "storageKey": null
                  },
                  v3
                ],
                "idField": "id"
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
                  v2,
                  v0,
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextSale",
                    "selections": v7
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextGene",
                    "selections": v7
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFair",
                    "selections": v7
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextRelatedArtist",
                    "selections": v9
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFollowedArtist",
                    "selections": v9
                  }
                ],
                "idField": "__id"
              }
            ],
            "idField": "__id"
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist_modules",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageArtistModule",
            "plural": true,
            "selections": [
              v0,
              v1
            ],
            "idField": "__id"
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fairs_module",
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
                  v3,
                  v5,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": v8,
                    "idField": "__id"
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "mobile_image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      v3,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  v0
                ],
                "idField": "__id"
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '74a905fbc1c502a7df7f92853faa44f8';
export default node;
