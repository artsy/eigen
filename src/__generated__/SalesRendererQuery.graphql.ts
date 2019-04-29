/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Sales_viewer$ref } from "./Sales_viewer.graphql";
export type SalesRendererQueryVariables = {};
export type SalesRendererQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": Sales_viewer$ref;
    }) | null;
};
export type SalesRendererQuery = {
    readonly response: SalesRendererQueryResponse;
    readonly variables: SalesRendererQueryVariables;
};



/*
query SalesRendererQuery {
  viewer {
    ...Sales_viewer
  }
}

fragment Sales_viewer on Viewer {
  sales(live: true, is_auction: true, size: 100, sort: TIMELY_AT_NAME_ASC) {
    ...SaleListItem_sale
    href
    live_start_at
    __id: id
  }
  ...LotsByFollowedArtists_viewer
}

fragment SaleListItem_sale on Sale {
  gravityID
  name
  href
  is_open
  is_live_open
  live_url_if_open
  start_at
  end_at
  registration_ends_at
  live_start_at
  display_timely_at
  cover_image {
    url(version: "large")
    aspect_ratio
  }
  __id: id
}

fragment LotsByFollowedArtists_viewer on Viewer {
  sale_artworks: sale_artworks(first: 10, live_sale: true, is_auction: true, include_artworks_by_followed_artists: true) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        artwork {
          ...GenericGrid_artworks
          __id: id
        }
        __id: id
        __typename
      }
    }
  }
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
var v0 = {
  "kind": "Literal",
  "name": "is_auction",
  "value": true,
  "type": "Boolean"
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
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
  "name": "is_open",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_live_open",
  "args": null,
  "storageKey": null
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
  "name": "display_timely_at",
  "args": null,
  "storageKey": null
},
v7 = {
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
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspect_ratio",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": "__id",
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
],
v12 = [
  v5,
  v9
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "SalesRendererQuery",
  "id": null,
  "text": "query SalesRendererQuery {\n  viewer {\n    ...Sales_viewer\n  }\n}\n\nfragment Sales_viewer on Viewer {\n  sales(live: true, is_auction: true, size: 100, sort: TIMELY_AT_NAME_ASC) {\n    ...SaleListItem_sale\n    href\n    live_start_at\n    __id: id\n  }\n  ...LotsByFollowedArtists_viewer\n}\n\nfragment SaleListItem_sale on Sale {\n  gravityID\n  name\n  href\n  is_open\n  is_live_open\n  live_url_if_open\n  start_at\n  end_at\n  registration_ends_at\n  live_start_at\n  display_timely_at\n  cover_image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  __id: id\n}\n\nfragment LotsByFollowedArtists_viewer on Viewer {\n  sale_artworks: sale_artworks(first: 10, live_sale: true, is_auction: true, include_artworks_by_followed_artists: true) {\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        artwork {\n          ...GenericGrid_artworks\n          __id: id\n        }\n        __id: id\n        __typename\n      }\n    }\n  }\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SalesRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "viewer",
        "name": "__viewer_viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Sales_viewer",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SalesRendererQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sales",
            "storageKey": "sales(is_auction:true,live:true,size:100,sort:\"TIMELY_AT_NAME_ASC\")",
            "args": [
              v0,
              {
                "kind": "Literal",
                "name": "live",
                "value": true,
                "type": "Boolean"
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 100,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "TIMELY_AT_NAME_ASC",
                "type": "SaleSorts"
              }
            ],
            "concreteType": "Sale",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "start_at",
                "args": null,
                "storageKey": null
              },
              v1,
              v2,
              v3,
              v4,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "live_url_if_open",
                "args": null,
                "storageKey": null
              },
              v5,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "end_at",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "registration_ends_at",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "live_start_at",
                "args": null,
                "storageKey": null
              },
              v6,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "cover_image",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  v7,
                  v8
                ]
              },
              v9
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "sale_artworks",
            "name": "sale_artworks",
            "storageKey": "sale_artworks(first:10,include_artworks_by_followed_artists:true,is_auction:true,live_sale:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "include_artworks_by_followed_artists",
                "value": true,
                "type": "Boolean"
              },
              v0,
              {
                "kind": "Literal",
                "name": "live_sale",
                "value": true,
                "type": "Boolean"
              }
            ],
            "concreteType": "SaleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworksEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
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
                            "name": "id",
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
                              v8,
                              v7
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "title",
                            "args": null,
                            "storageKey": null
                          },
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
                          v1,
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
                              v4,
                              v3,
                              v10,
                              v6,
                              v9
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
                                  v9
                                ]
                              },
                              v9
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
                            "selections": v12
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": v12
                          },
                          v2,
                          v9
                        ]
                      },
                      v9,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "sale_artworks",
            "name": "sale_artworks",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "include_artworks_by_followed_artists",
                "value": true,
                "type": "Boolean"
              },
              v0,
              {
                "kind": "Literal",
                "name": "live_sale",
                "value": true,
                "type": "Boolean"
              }
            ],
            "handle": "connection",
            "key": "LotsByFollowedArtists_sale_artworks",
            "filters": [
              "live_sale",
              "is_auction",
              "include_artworks_by_followed_artists"
            ]
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "viewer",
        "args": null,
        "handle": "viewer",
        "key": "",
        "filters": null
      }
    ]
  }
};
})();
(node as any).hash = '96db6414736bd4634b88cf6c32e5121f';
export default node;
