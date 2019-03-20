/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ArtworkRail_rail$ref } from "./ArtworkRail_rail.graphql";
export type ArtworkRailRefetchQueryVariables = {
    readonly __id: string;
    readonly fetchContent: boolean;
};
export type ArtworkRailRefetchQueryResponse = {
    readonly node: ({
        readonly " $fragmentRefs": ArtworkRail_rail$ref;
    }) | null;
};
export type ArtworkRailRefetchQuery = {
    readonly response: ArtworkRailRefetchQueryResponse;
    readonly variables: ArtworkRailRefetchQueryVariables;
};



/*
query ArtworkRailRefetchQuery(
  $__id: ID!
  $fetchContent: Boolean!
) {
  node(__id: $__id) {
    __typename
    ...ArtworkRail_rail_abFTe
    __id
  }
}

fragment ArtworkRail_rail_abFTe on HomePageArtworkModule {
  ...ArtworkRailHeader_rail
  __id
  key
  params {
    medium
    price_range
    __id: id
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
  results @include(if: $fetchContent) {
    ...GenericGrid_artworks
    __id
  }
}

fragment ArtworkRailHeader_rail on HomePageArtworkModule {
  title
  key
  context {
    __typename
    ... on HomePageModuleContextRelatedArtist {
      artist {
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

fragment GenericGrid_artworks on Artwork {
  __id
  id
  image {
    aspect_ratio
  }
  ...Artwork_artwork
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  id
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    __id
  }
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_closed
      __id
    }
    __id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id
  }
  partner {
    name
    __id
  }
  href
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "__id",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "fetchContent",
    "type": "Boolean!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "__id",
    "variableName": "__id",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
  "name": "title",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  v2
],
v8 = [
  v6
],
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v10 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ArtworkRailRefetchQuery",
  "id": "850f91d889ab480bea67b05daa30cefe",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkRailRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtworkRail_rail",
            "args": [
              {
                "kind": "Variable",
                "name": "fetchContent",
                "variableName": "fetchContent",
                "type": null
              }
            ]
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkRailRefetchQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          v3,
          v2,
          {
            "kind": "InlineFragment",
            "type": "HomePageArtworkModule",
            "selections": [
              v4,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "key",
                "args": null,
                "storageKey": null
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
                  v3,
                  v2,
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextRelatedArtist",
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
                          v5,
                          v2,
                          v6
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "based_on",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": v7
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFair",
                    "selections": v8
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFollowedArtist",
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
                          v6,
                          v2
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextGene",
                    "selections": v8
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextSale",
                    "selections": v8
                  }
                ]
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
                  {
                    "kind": "ScalarField",
                    "alias": "__id",
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "Condition",
                "passingValue": true,
                "condition": "fetchContent",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "results",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": true,
                    "selections": [
                      v2,
                      v5,
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
                            "name": "aspect_ratio",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large",
                                "type": "[String]"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          }
                        ]
                      },
                      v4,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "date",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "sale_message",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_in_auction",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_biddable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_acquireable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_offerable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "sale",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Sale",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_auction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_live_open",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_open",
                            "args": null,
                            "storageKey": null
                          },
                          v9,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "display_timely_at",
                            "args": null,
                            "storageKey": null
                          },
                          v2
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "sale_artwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "opening_bid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkOpeningBid",
                            "plural": false,
                            "selections": v10
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "current_bid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "plural": false,
                            "selections": v10
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "bidder_positions_count",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              v9,
                              v2
                            ]
                          },
                          v2
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": "artists(shallow:true)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "shallow",
                            "value": true,
                            "type": "Boolean"
                          }
                        ],
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": v7
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": v7
                      },
                      v6
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
};
})();
(node as any).hash = '9c2ebde1c9a035a51d0b95fa5f3bef61';
export default node;
