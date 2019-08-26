/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Sales_query$ref } from "./Sales_query.graphql";
export type SalesRendererQueryVariables = {};
export type SalesRendererQueryResponse = {
    readonly " $fragmentRefs": Sales_query$ref;
};
export type SalesRendererQuery = {
    readonly response: SalesRendererQueryResponse;
    readonly variables: SalesRendererQueryVariables;
};



/*
query SalesRendererQuery {
  ...Sales_query
}

fragment Sales_query on Query {
  sales(live: true, isAuction: true, size: 100, sort: TIMELY_AT_NAME_ASC) {
    ...SaleListItem_sale
    href
    live_start_at: liveStartAt
    id
  }
  ...LotsByFollowedArtists_query
}

fragment SaleListItem_sale on Sale {
  slug
  name
  href
  is_open: isOpen
  is_live_open: isLiveOpen
  live_url_if_open: liveURLIfOpen
  start_at: startAt
  end_at: endAt
  registration_ends_at: registrationEndsAt
  live_start_at: liveStartAt
  display_timely_at: displayTimelyAt
  cover_image: coverImage {
    url(version: "large")
    aspect_ratio: aspectRatio
  }
}

fragment LotsByFollowedArtists_query on Query {
  sale_artworks: saleArtworksConnection(first: 10, liveSale: true, isAuction: true, includeArtworksByFollowedArtists: true) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        artwork {
          ...GenericGrid_artworks
          id
        }
        id
        __typename
      }
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  slug
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_in_auction: isInAuction
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_live_open: isLiveOpen
    is_open: isOpen
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "isAuction",
  "value": true
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": "is_open",
  "name": "isOpen",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": "is_live_open",
  "name": "isLiveOpen",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": "display_timely_at",
  "name": "displayTimelyAt",
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
      "value": "large"
    }
  ],
  "storageKey": "url(version:\"large\")"
},
v8 = {
  "kind": "ScalarField",
  "alias": "aspect_ratio",
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": true
  },
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "liveSale",
    "value": true
  }
],
v11 = [
  (v2/*: any*/),
  (v9/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SalesRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "Sales_query",
        "args": null
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
        "name": "sales",
        "storageKey": "sales(isAuction:true,live:true,size:100,sort:\"TIMELY_AT_NAME_ASC\")",
        "args": [
          (v0/*: any*/),
          {
            "kind": "Literal",
            "name": "live",
            "value": true
          },
          {
            "kind": "Literal",
            "name": "size",
            "value": 100
          },
          {
            "kind": "Literal",
            "name": "sort",
            "value": "TIMELY_AT_NAME_ASC"
          }
        ],
        "concreteType": "Sale",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "live_url_if_open",
            "name": "liveURLIfOpen",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "start_at",
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "end_at",
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "registration_ends_at",
            "name": "registrationEndsAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "live_start_at",
            "name": "liveStartAt",
            "args": null,
            "storageKey": null
          },
          (v6/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "cover_image",
            "name": "coverImage",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/)
            ]
          },
          (v9/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "sale_artworks",
        "name": "saleArtworksConnection",
        "storageKey": "saleArtworksConnection(first:10,includeArtworksByFollowedArtists:true,isAuction:true,liveSale:true)",
        "args": (v10/*: any*/),
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
                      (v9/*: any*/),
                      (v1/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v7/*: any*/)
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
                        "alias": "sale_message",
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_in_auction",
                        "name": "isInAuction",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_biddable",
                        "name": "isBiddable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_acquireable",
                        "name": "isAcquireable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_offerable",
                        "name": "isOfferable",
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
                            "alias": "is_auction",
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": "is_closed",
                            "name": "isClosed",
                            "args": null,
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          (v9/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "sale_artwork",
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": "current_bid",
                            "name": "currentBid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v9/*: any*/)
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
                            "value": true
                          }
                        ],
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": (v11/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v11/*: any*/)
                      },
                      (v3/*: any*/)
                    ]
                  },
                  (v9/*: any*/),
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
        "name": "saleArtworksConnection",
        "args": (v10/*: any*/),
        "handle": "connection",
        "key": "LotsByFollowedArtists_sale_artworks",
        "filters": [
          "liveSale",
          "isAuction",
          "includeArtworksByFollowedArtists"
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SalesRendererQuery",
    "id": "58d102e32119b0caeab1ac7ad5998b84",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'aa48dd8704172d3d3f07388648a86454';
export default node;
