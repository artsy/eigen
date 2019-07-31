/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairBooth_show$ref } from "./FairBooth_show.graphql";
export type FairBoothQueryVariables = {
    readonly showID: string;
};
export type FairBoothQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FairBooth_show$ref;
    } | null;
};
export type FairBoothQuery = {
    readonly response: FairBoothQueryResponse;
    readonly variables: FairBoothQueryVariables;
};



/*
query FairBoothQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...FairBooth_show
    id
  }
}

fragment FairBooth_show on Show {
  slug
  internalID
  ...FairBoothHeader_show
  ...ShowArtworksPreview_show
  ...ShowArtistsPreview_show
  ...ShowArtists_show
  ...ShowArtworks_show
}

fragment FairBoothHeader_show on Show {
  fair {
    name
    id
  }
  partner {
    __typename
    ... on Partner {
      name
      slug
      internalID
      id
      href
      profile {
        internalID
        slug
        is_followed: isFollowed
        id
      }
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  counts {
    artworks
    artists
  }
  location {
    display
    id
  }
}

fragment ShowArtworksPreview_show on Show {
  id
  counts {
    artworks
  }
  artworks_connection: artworksConnection(first: 6) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
  }
}

fragment ShowArtistsPreview_show on Show {
  internalID
  slug
  artists {
    internalID
    slug
    href
    ...ArtistListItem_artist
    id
  }
  artists_without_artworks: artistsWithoutArtworks {
    internalID
    slug
    href
    ...ArtistListItem_artist
    id
  }
}

fragment ShowArtists_show on Show {
  internalID
  slug
  artists_grouped_by_name: artistsGroupedByName {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id: sortableID
      href
      id
    }
  }
}

fragment ShowArtworks_show on Show {
  id
  slug
  internalID
  filteredArtworks(size: 0, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    id
  }
}

fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
  ...Filters_filteredArtworks
  ...ArtworksGridPaginationContainer_filteredArtworks
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      internalID
      name
      id
    }
  }
}

fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {
  id
  artworks: artworksConnection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        slug
        id
        image {
          aspect_ratio: aspectRatio
        }
        ...ArtworkGridItem_artwork
        __typename
      }
      cursor
    }
  }
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

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
v6 = [
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v11 = {
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
      "alias": "aspect_ratio",
      "name": "aspectRatio",
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
          "value": "large"
        }
      ],
      "storageKey": "url(version:\"large\")"
    }
  ]
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": "sale_message",
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": "is_in_auction",
  "name": "isInAuction",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": "is_biddable",
  "name": "isBiddable",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": "is_acquireable",
  "name": "isAcquireable",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": "is_offerable",
  "name": "isOfferable",
  "args": null,
  "storageKey": null
},
v19 = {
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
    {
      "kind": "ScalarField",
      "alias": "is_live_open",
      "name": "isLiveOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_open",
      "name": "isOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_closed",
      "name": "isClosed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "display_timely_at",
      "name": "displayTimelyAt",
      "args": null,
      "storageKey": null
    },
    (v5/*: any*/)
  ]
},
v20 = {
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
        (v10/*: any*/)
      ]
    },
    (v5/*: any*/)
  ]
},
v21 = {
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
  "selections": (v6/*: any*/)
},
v22 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": (v6/*: any*/)
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v24 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v25 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v26 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v27 = {
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
      "args": null,
      "storageKey": null
    }
  ]
},
v28 = [
  (v3/*: any*/),
  (v2/*: any*/),
  (v8/*: any*/),
  (v5/*: any*/),
  (v4/*: any*/),
  (v23/*: any*/),
  (v9/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/),
  (v26/*: any*/),
  (v27/*: any*/)
],
v29 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairBoothQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairBooth_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBoothQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fair",
            "storageKey": null,
            "args": null,
            "concreteType": "Fair",
            "plural": false,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v5/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/),
                      (v9/*: any*/),
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artworks",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artists",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v10/*: any*/),
              (v5/*: any*/)
            ]
          },
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "artworks_connection",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:6)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 6
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
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v8/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": (v28/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "artists_without_artworks",
            "name": "artistsWithoutArtworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": (v28/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "artists_grouped_by_name",
            "name": "artistsGroupedByName",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistGroup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "letter",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v23/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "sortable_id",
                    "name": "sortableID",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",priceRange:\"*-*\",size:0)",
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MEDIUM",
                  "PRICE_RANGE",
                  "TOTAL"
                ]
              },
              {
                "kind": "Literal",
                "name": "medium",
                "value": "*"
              },
              {
                "kind": "Literal",
                "name": "priceRange",
                "value": "*-*"
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0
              }
            ],
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "aggregations",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slice",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "counts",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ]
                  }
                ]
              },
              (v5/*: any*/),
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:10)",
                "args": (v29/*: any*/),
                "concreteType": "ArtworkConnection",
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
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
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
                          (v2/*: any*/),
                          (v5/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          (v8/*: any*/),
                          (v7/*: any*/)
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artworks",
                "name": "artworksConnection",
                "args": (v29/*: any*/),
                "handle": "connection",
                "key": "ArtworksGridPaginationContainer_artworks",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FairBoothQuery",
    "id": "878735c9a767b38bf7a2661850ab2f08",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a5a94f15b08c48781401d35a1bd49987';
export default node;
