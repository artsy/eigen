/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Sales_viewer$ref } from "./Sales_viewer.graphql";
export type SalesQueryVariables = {};
export type SalesQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": Sales_viewer$ref;
    }) | null;
};
export type SalesQuery = {
    readonly response: SalesQueryResponse;
    readonly variables: SalesQueryVariables;
};



/*
query SalesQuery {
  viewer {
    ...Sales_viewer
  }
}

fragment Sales_viewer on Viewer {
  sales(live: true, is_auction: true, size: 100, sort: TIMELY_AT_NAME_ASC) {
    ...SaleListItem_sale
    href
    live_start_at
    __id
  }
  ...LotsByFollowedArtists_viewer
}

fragment SaleListItem_sale on Sale {
  id
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
  __id
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
          __id
        }
        __id
        __typename
      }
    }
  }
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
  __id
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspect_ratio",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "SalesQuery",
  "id": "21b76fcfde2c0b7947a4e8a9feb4dcc9",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SalesQuery",
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
    "name": "SalesQuery",
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
                "name": "is_open",
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
                "name": "live_url_if_open",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "display_timely_at",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "cover_image",
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
                        "value": "large",
                        "type": "[String]"
                      }
                    ],
                    "storageKey": "url(version:\"large\")"
                  },
                  v2
                ]
              },
              v3
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
                          v3,
                          v1,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": [
                              v2
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "title",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      v3,
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
(node as any).hash = '9395045e8ee2d96df4d7ea5907766374';
export default node;
