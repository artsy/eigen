/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ArtworkRail_rail$ref } from "./ArtworkRail_rail.graphql";
export type ArtworkRailRefetchQueryVariables = {
    readonly id: string;
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
  $id: ID!
  $fetchContent: Boolean!
) {
  node(__id: $id) {
    __typename
    ...ArtworkRail_rail_abFTe
    __id: id
  }
}

fragment ArtworkRail_rail_abFTe on HomePageArtworkModule {
  ...ArtworkRailHeader_rail
  id
  key
  params {
    medium
    price_range
  }
  context {
    __typename
    ... on HomePageModuleContextFollowedArtist {
      artist {
        href
        __id: id
      }
    }
    ... on HomePageModuleContextRelatedArtist {
      artist {
        href
        __id: id
      }
    }
    ... on HomePageModuleContextFair {
      href
      __id: id
    }
    ... on HomePageModuleContextGene {
      href
    }
    ... on HomePageModuleContextSale {
      href
    }
    ... on Node {
      __id: id
    }
  }
  results @include(if: $fetchContent) {
    ...GenericGrid_artworks
    __id: id
  }
  __id: id
}

fragment ArtworkRailHeader_rail on HomePageArtworkModule {
  title
  key
  context {
    __typename
    ... on HomePageModuleContextRelatedArtist {
      artist {
        gravityID
        __id: id
      }
      based_on {
        name
        __id: id
      }
    }
    ... on Node {
      __id: id
    }
    ... on HomePageModuleContextFair {
      __id: id
    }
  }
  __id: id
}

fragment GenericGrid_artworks on Artwork {
  id
  gravityID
  image {
    aspect_ratio
  }
  ...Artwork_artwork
  __id: id
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  gravityID
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    __id: id
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
      __id: id
    }
    __id: id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id: id
  }
  partner {
    name
    __id: id
  }
  href
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
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
    "variableName": "id",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
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
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = [
  v5
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v8 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  v2
],
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v11 = [
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
  "id": null,
  "text": "query ArtworkRailRefetchQuery(\n  $id: ID!\n  $fetchContent: Boolean!\n) {\n  node(__id: $id) {\n    __typename\n    ...ArtworkRail_rail_abFTe\n    __id: id\n  }\n}\n\nfragment ArtworkRail_rail_abFTe on HomePageArtworkModule {\n  ...ArtworkRailHeader_rail\n  id\n  key\n  params {\n    medium\n    price_range\n  }\n  context {\n    __typename\n    ... on HomePageModuleContextFollowedArtist {\n      artist {\n        href\n        __id: id\n      }\n    }\n    ... on HomePageModuleContextRelatedArtist {\n      artist {\n        href\n        __id: id\n      }\n    }\n    ... on HomePageModuleContextFair {\n      href\n      __id: id\n    }\n    ... on HomePageModuleContextGene {\n      href\n    }\n    ... on HomePageModuleContextSale {\n      href\n    }\n    ... on Node {\n      __id: id\n    }\n  }\n  results @include(if: $fetchContent) {\n    ...GenericGrid_artworks\n    __id: id\n  }\n  __id: id\n}\n\nfragment ArtworkRailHeader_rail on HomePageArtworkModule {\n  title\n  key\n  context {\n    __typename\n    ... on HomePageModuleContextRelatedArtist {\n      artist {\n        gravityID\n        __id: id\n      }\n      based_on {\n        name\n        __id: id\n      }\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on HomePageModuleContextFair {\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
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
                    "type": "HomePageModuleContextSale",
                    "selections": v6
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextGene",
                    "selections": v6
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
                          v5,
                          v2
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageModuleContextFair",
                    "selections": v6
                  },
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
                          v7,
                          v2,
                          v5
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
                        "selections": v8
                      }
                    ]
                  }
                ]
              },
              v9,
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_acquireable",
                        "args": null,
                        "storageKey": null
                      },
                      v9,
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
                      v7,
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
                          v10,
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
                            "selections": v11
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "current_bid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "plural": false,
                            "selections": v11
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
                              v10,
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
                        "selections": v8
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": v8
                      },
                      v5,
                      v2
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
(node as any).hash = 'a949e8668e5be1593e2a46f702134c96';
export default node;
