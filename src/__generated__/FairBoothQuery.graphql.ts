/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairBooth_show$ref } from "./FairBooth_show.graphql";
export type FairBoothQueryVariables = {
    readonly showID: string;
};
export type FairBoothQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": FairBooth_show$ref;
    }) | null;
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
    __id: id
  }
}

fragment FairBooth_show on Show {
  gravityID
  internalID
  ...FairBoothHeader_show
  ...ShowArtworksPreview_show
  ...ShowArtistsPreview_show
  ...ShowArtists_show
  ...ShowArtworks_show
  __id: id
}

fragment FairBoothHeader_show on Show {
  fair {
    name
    __id: id
  }
  partner {
    __typename
    ... on Partner {
      name
      gravityID
      internalID
      id
      href
      profile {
        internalID
        gravityID
        is_followed
        __id: id
      }
    }
    ... on Node {
      __id: id
    }
    ... on ExternalPartner {
      __id: id
    }
  }
  counts {
    artworks
    artists
  }
  location {
    display
    __id: id
  }
  __id: id
}

fragment ShowArtworksPreview_show on Show {
  id
  artworks(size: 6) {
    ...GenericGrid_artworks
    __id: id
  }
  counts {
    artworks
  }
  __id: id
}

fragment ShowArtistsPreview_show on Show {
  internalID
  gravityID
  artists {
    internalID
    gravityID
    href
    ...ArtistListItem_artist
    __id: id
  }
  artists_without_artworks {
    internalID
    gravityID
    href
    ...ArtistListItem_artist
    __id: id
  }
  __id: id
}

fragment ShowArtists_show on Show {
  internalID
  gravityID
  artists_grouped_by_name {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id
      href
      __id: id
    }
  }
  __id: id
}

fragment ShowArtworks_show on Show {
  id
  gravityID
  internalID
  filteredArtworks(size: 0, medium: "*", price_range: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    __id: id
  }
  __id: id
}

fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
  ...Filters_filteredArtworks
  ...ArtworksGridPaginationContainer_filteredArtworks
  __id: id
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      gravityID
      name
      __id: id
    }
  }
  __id: id
}

fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {
  id
  artworks: artworks_connection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        gravityID
        id
        image {
          aspect_ratio
        }
        ...Artwork_artwork
        __id: id
        __typename
      }
      cursor
    }
  }
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

fragment ArtistListItem_artist on Artist {
  id
  internalID
  gravityID
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
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
    "variableName": "showID",
    "type": "String!"
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
  "name": "gravityID",
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
v5 = [
  v4,
  v2
],
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v13 = {
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
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "sale_message",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_in_auction",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_offerable",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v21 = {
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
    v20,
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
v22 = [
  v11
],
v23 = {
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
      "selections": v22
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": v22
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
        v20,
        v2
      ]
    },
    v2
  ]
},
v24 = {
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
  "selections": v5
},
v25 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v5
},
v26 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v27 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v28 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v29 = {
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
v30 = [
  v10,
  v7,
  v9,
  v8,
  v4,
  v3,
  v26,
  v27,
  v28,
  v29,
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairBoothQuery",
  "id": null,
  "text": "query FairBoothQuery(\n  $showID: String!\n) {\n  show(id: $showID) {\n    ...FairBooth_show\n    __id: id\n  }\n}\n\nfragment FairBooth_show on Show {\n  gravityID\n  internalID\n  ...FairBoothHeader_show\n  ...ShowArtworksPreview_show\n  ...ShowArtistsPreview_show\n  ...ShowArtists_show\n  ...ShowArtworks_show\n  __id: id\n}\n\nfragment FairBoothHeader_show on Show {\n  fair {\n    name\n    __id: id\n  }\n  partner {\n    __typename\n    ... on Partner {\n      name\n      gravityID\n      internalID\n      id\n      href\n      profile {\n        internalID\n        gravityID\n        is_followed\n        __id: id\n      }\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  counts {\n    artworks\n    artists\n  }\n  location {\n    display\n    __id: id\n  }\n  __id: id\n}\n\nfragment ShowArtworksPreview_show on Show {\n  id\n  artworks(size: 6) {\n    ...GenericGrid_artworks\n    __id: id\n  }\n  counts {\n    artworks\n  }\n  __id: id\n}\n\nfragment ShowArtistsPreview_show on Show {\n  internalID\n  gravityID\n  artists {\n    internalID\n    gravityID\n    href\n    ...ArtistListItem_artist\n    __id: id\n  }\n  artists_without_artworks {\n    internalID\n    gravityID\n    href\n    ...ArtistListItem_artist\n    __id: id\n  }\n  __id: id\n}\n\nfragment ShowArtists_show on Show {\n  internalID\n  gravityID\n  artists_grouped_by_name {\n    letter\n    items {\n      ...ArtistListItem_artist\n      sortable_id\n      href\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment ShowArtworks_show on Show {\n  id\n  gravityID\n  internalID\n  filteredArtworks(size: 0, medium: \"*\", price_range: \"*-*\", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {\n    ...FilteredInfiniteScrollGrid_filteredArtworks\n    __id: id\n  }\n  __id: id\n}\n\nfragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {\n  ...Filters_filteredArtworks\n  ...ArtworksGridPaginationContainer_filteredArtworks\n  __id: id\n}\n\nfragment Filters_filteredArtworks on FilterArtworks {\n  aggregations {\n    slice\n    counts {\n      gravityID\n      name\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {\n  id\n  artworks: artworks_connection(first: 10) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        gravityID\n        id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n\nfragment ArtistListItem_artist on Artist {\n  id\n  internalID\n  gravityID\n  name\n  is_followed\n  nationality\n  birthday\n  deathday\n  image {\n    url\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairBoothQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairBooth_show",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBoothQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v2,
          v3,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fair",
            "storageKey": null,
            "args": null,
            "concreteType": "Fair",
            "plural": false,
            "selections": v5
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
              v6,
              v2,
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  v4,
                  v3,
                  v7,
                  v8,
                  v9,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      v7,
                      v3,
                      v10,
                      v2
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
              v11,
              v2
            ]
          },
          v7,
          v8,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworks",
            "storageKey": "artworks(size:6)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 6,
                "type": "Int"
              }
            ],
            "concreteType": "Artwork",
            "plural": true,
            "selections": [
              v12,
              v8,
              v13,
              v14,
              v15,
              v16,
              v17,
              v18,
              v3,
              v19,
              v21,
              v23,
              v24,
              v25,
              v9,
              v2
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
            "selections": v30
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists_without_artworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": v30
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists_grouped_by_name",
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
                  v27,
                  v8,
                  v3,
                  v4,
                  v10,
                  v26,
                  v7,
                  v28,
                  v29,
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "sortable_id",
                    "args": null,
                    "storageKey": null
                  },
                  v9
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MEDIUM",
                  "PRICE_RANGE",
                  "TOTAL"
                ],
                "type": "[ArtworkAggregation]"
              },
              {
                "kind": "Literal",
                "name": "medium",
                "value": "*",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "price_range",
                "value": "*-*",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0,
                "type": "Int"
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
                      v3,
                      v4,
                      v2
                    ]
                  }
                ]
              },
              v2,
              v8,
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworks_connection",
                "storageKey": "artworks_connection(first:10)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
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
                          v12,
                          v3,
                          v13,
                          v14,
                          v15,
                          v16,
                          v17,
                          v18,
                          v8,
                          v19,
                          v21,
                          v23,
                          v24,
                          v25,
                          v9,
                          v2,
                          v6
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
                "name": "artworks_connection",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
                "handle": "connection",
                "key": "ArtworksGridPaginationContainer_artworks",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'a5a94f15b08c48781401d35a1bd49987';
export default node;
