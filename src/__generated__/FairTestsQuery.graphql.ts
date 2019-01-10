/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Fair_fair$ref } from "./Fair_fair.graphql";
export type FairTestsQueryVariables = {};
export type FairTestsQueryResponse = {
    readonly fair: ({
        readonly " $fragmentRefs": Fair_fair$ref;
    }) | null;
};
export type FairTestsQuery = {
    readonly response: FairTestsQueryResponse;
    readonly variables: FairTestsQueryVariables;
};



/*
query FairTestsQuery {
  fair(id: "sofa-chicago-2018") {
    ...Fair_fair
    __id
  }
}

fragment Fair_fair on Fair {
  id
  ...FairDetail_fair
  ...FairArtists_fair
  ...FairArtworks_fair
  __id
}

fragment FairDetail_fair on Fair {
  ...FairHeader_fair
  id
  name
  hours
  location {
    ...LocationMap_location
    __id
  }
  profile {
    name
    __id
  }
  shows: shows_connection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...FairBoothPreview_show
        ...FairBooth_show
        ...ShowArtworks_show
        __id
        __typename
      }
    }
  }
  __id
}

fragment FairArtists_fair on Fair {
  id
  artists(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...ArtistListItem_artist
        sortable_id
        __id
        __typename
      }
    }
  }
  __id
}

fragment FairArtworks_fair on Fair {
  __id
  artworks: filteredArtworks(size: 0, medium: "*", price_range: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    __id
  }
}

fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
  ...Filters_filteredArtworks
  ...ArtworksGridPaginationContainer_filteredArtworks
  __id
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      id
      name
      __id
    }
  }
  __id
}

fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {
  __id
  artworks: artworks_connection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        __id
        image {
          aspect_ratio
        }
        ...Artwork_artwork
        __typename
      }
      cursor
    }
  }
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
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

fragment ArtistListItem_artist on Artist {
  id
  __id
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment FairHeader_fair on Fair {
  id
  name
  exhibitors_grouped_by_name {
    exhibitors
    profile_ids
  }
  counts {
    artists
    partners
  }
  artists_names: artists(first: 2) {
    edges {
      node {
        name
        href
        __id
      }
    }
  }
  image {
    image_url
    aspect_ratio
    url
  }
  profile {
    icon {
      id
      href
      height
      width
      url
    }
    name
    __id
  }
  start_at
  end_at
  __id
}

fragment LocationMap_location on Location {
  __id
  id
  city
  address
  address_2
  display
  coordinates {
    lat
    lng
  }
  day_schedules {
    start_time
    end_time
    day_of_week
  }
}

fragment FairBoothPreview_show on Show {
  id
  name
  is_fair_booth
  ...FairBooth_show
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      __id
    }
    ... on Node {
      __id
    }
  }
  fair {
    name
    __id
  }
  cover_image {
    url
  }
  location {
    display
    __id
  }
  artworks_connection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        __id
      }
    }
  }
  __id
}

fragment FairBooth_show on Show {
  ...FairBoothHeader_show
  ...ShowArtworksPreview_show
  ...ShowArtistsPreview_show
  ...ShowArtists_show
  ...ShowArtworks_show
  __id
}

fragment ShowArtworks_show on Show {
  __id
  filteredArtworks(size: 0, medium: "*", price_range: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    __id
  }
}

fragment FairBoothHeader_show on Show {
  fair {
    name
    __id
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      __id
    }
    ... on Node {
      __id
    }
  }
  counts {
    artworks
    artists
  }
  __id
}

fragment ShowArtworksPreview_show on Show {
  __id
  artworks(size: 6) {
    ...GenericGrid_artworks
    __id
  }
  counts {
    artworks
  }
}

fragment ShowArtistsPreview_show on Show {
  artists {
    id
    ...ArtistListItem_artist
    __id
  }
  __id
}

fragment ShowArtists_show on Show {
  artists_grouped_by_name {
    letter
    items {
      ...ArtistListItem_artist
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "sofa-chicago-2018",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artists",
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
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspect_ratio",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v9 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10,
    "type": "Int"
  }
],
v10 = {
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
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
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
    v6,
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
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v20 = {
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
    v19,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "display_timely_at",
      "args": null,
      "storageKey": null
    },
    v1
  ]
},
v21 = [
  v8
],
v22 = {
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
      "selections": v21
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": v21
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
        v19,
        v1
      ]
    },
    v1
  ]
},
v23 = [
  v4,
  v1
],
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
  "selections": v23
},
v25 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v23
},
v26 = [
  v12,
  v1,
  v13,
  v14,
  v15,
  v16,
  v17,
  v2,
  v18,
  v20,
  v22,
  v24,
  v25,
  v5
],
v27 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v28 = [
  v4
],
v29 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v30 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v31 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v32 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v33 = [
  v7
],
v34 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": v33
},
v35 = [
  v2,
  v1,
  v4,
  v29,
  v30,
  v31,
  v32,
  v34
],
v36 = [
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
v37 = [
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
          v2,
          v4,
          v1
        ]
      }
    ]
  },
  v1,
  {
    "kind": "LinkedField",
    "alias": "artworks",
    "name": "artworks_connection",
    "storageKey": "artworks_connection(first:10)",
    "args": v9,
    "concreteType": "ArtworkConnection",
    "plural": false,
    "selections": [
      v10,
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
              v2,
              v13,
              v14,
              v15,
              v16,
              v17,
              v1,
              v18,
              v20,
              v22,
              v24,
              v25,
              v5,
              v27
            ]
          },
          v11
        ]
      }
    ]
  },
  {
    "kind": "LinkedHandle",
    "alias": "artworks",
    "name": "artworks_connection",
    "args": v9,
    "handle": "connection",
    "key": "ArtworksGridPaginationContainer_artworks",
    "filters": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairTestsQuery",
  "id": "9881faa2da419fd4e9a2e0fa8cc08cee",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair_fair",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "start_at",
            "args": null,
            "storageKey": null
          },
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "exhibitors_grouped_by_name",
            "storageKey": null,
            "args": null,
            "concreteType": "FairExhibitorsGroup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "exhibitors",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "profile_ids",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "FairCounts",
            "plural": false,
            "selections": [
              v3,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "partners",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "artists_names",
            "name": "artists",
            "storageKey": "artists(first:2)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2,
                "type": "Int"
              }
            ],
            "concreteType": "ArtistConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": false,
                    "selections": [
                      v4,
                      v5,
                      v1
                    ]
                  }
                ]
              }
            ]
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "image_url",
                "args": null,
                "storageKey": null
              },
              v6,
              v7
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "icon",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  v2,
                  v5,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "height",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "width",
                    "args": null,
                    "storageKey": null
                  },
                  v7
                ]
              },
              v4,
              v1
            ]
          },
          v4,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "end_at",
            "args": null,
            "storageKey": null
          },
          v1,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "hours",
            "args": null,
            "storageKey": null
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
              v1,
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "city",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "address",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "address_2",
                "args": null,
                "storageKey": null
              },
              v8,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "coordinates",
                "storageKey": null,
                "args": null,
                "concreteType": "LatLng",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lat",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lng",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "day_schedules",
                "storageKey": null,
                "args": null,
                "concreteType": "DaySchedule",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "start_time",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "end_time",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "day_of_week",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "shows",
            "name": "shows_connection",
            "storageKey": "shows_connection(first:10)",
            "args": v9,
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              v10,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowEdge",
                "plural": true,
                "selections": [
                  v11,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Show",
                    "plural": false,
                    "selections": [
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
                        "selections": v26
                      },
                      v2,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_fair_booth",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "fair",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Fair",
                        "plural": false,
                        "selections": v23
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
                          v27,
                          v1,
                          {
                            "kind": "InlineFragment",
                            "type": "ExternalPartner",
                            "selections": v28
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": v28
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
                          v3
                        ]
                      },
                      v1,
                      v4,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": v35
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
                            "selections": v35
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "filteredArtworks",
                        "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
                        "args": v36,
                        "concreteType": "FilterArtworks",
                        "plural": false,
                        "selections": v37
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "cover_image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": v33
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
                          v8,
                          v1
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artworks_connection",
                        "storageKey": "artworks_connection(first:4)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 4,
                            "type": "Int"
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
                                "selections": v26
                              }
                            ]
                          }
                        ]
                      },
                      v27
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "shows",
            "name": "shows_connection",
            "args": v9,
            "handle": "connection",
            "key": "Fair_shows",
            "filters": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": "artists(first:10)",
            "args": v9,
            "concreteType": "ArtistConnection",
            "plural": false,
            "selections": [
              v10,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistEdge",
                "plural": true,
                "selections": [
                  v11,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": false,
                    "selections": [
                      v2,
                      v1,
                      v4,
                      v29,
                      v30,
                      v31,
                      v32,
                      v34,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "sortable_id",
                        "args": null,
                        "storageKey": null
                      },
                      v27
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "artists",
            "args": v9,
            "handle": "connection",
            "key": "Fair_artists",
            "filters": null
          },
          {
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
            "args": v36,
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": v37
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '83528fc8901e5c899aaa0f2736501c16';
export default node;
