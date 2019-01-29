/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairDetail_fair$ref } from "./FairDetail_fair.graphql";
export type FairDetailShowsQueryVariables = {
    readonly id: string;
    readonly count: number;
    readonly cursor?: string | null;
};
export type FairDetailShowsQueryResponse = {
    readonly fair: ({
        readonly " $fragmentRefs": FairDetail_fair$ref;
    }) | null;
};
export type FairDetailShowsQuery = {
    readonly response: FairDetailShowsQueryResponse;
    readonly variables: FairDetailShowsQueryVariables;
};



/*
query FairDetailShowsQuery(
  $id: String!
  $count: Int!
  $cursor: String
) {
  fair(id: $id) {
    ...FairDetail_fair_1G22uz
    __id
  }
}

fragment FairDetail_fair_1G22uz on Fair {
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
  shows: shows_connection(first: $count, after: $cursor) {
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

fragment FairBoothHeader_show on Show {
  fair {
    name
    __id
  }
  partner {
    __typename
    ... on Partner {
      name
      id
    }
    ... on ExternalPartner {
      name
      id
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
    href
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
    "kind": "LocalArgument",
    "name": "id",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "String!"
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
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
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artists",
  "args": null,
  "storageKey": null
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
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
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
    v8,
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
  v9
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
v24 = [
  v6,
  v2
],
v25 = {
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
  "selections": v24
},
v26 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v24
},
v27 = [
  v12,
  v2,
  v13,
  v14,
  v15,
  v16,
  v17,
  v3,
  v18,
  v19,
  v21,
  v23,
  v25,
  v26,
  v4
],
v28 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v29 = [
  v6,
  v3
],
v30 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v31 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v32 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v33 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v34 = [
  v5
],
v35 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": v34
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairDetailShowsQuery",
  "id": "a249a198859746a0a215fa64c651a808",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairDetailShowsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": v1,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairDetail_fair",
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor",
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
    "name": "FairDetailShowsQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": v1,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
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
                  v3,
                  v4,
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
                  v5
                ]
              },
              v6,
              v2
            ]
          },
          v3,
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
              v7,
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
                      v6,
                      v4,
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
              v8,
              v5
            ]
          },
          v6,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "start_at",
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
          v2,
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
              v2,
              v3,
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
              v9,
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
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "after",
                "variableName": "cursor",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "first",
                "variableName": "count",
                "type": "Int"
              }
            ],
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
                        "selections": v27
                      },
                      v3,
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
                        "selections": v24
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
                          v28,
                          v2,
                          {
                            "kind": "InlineFragment",
                            "type": "ExternalPartner",
                            "selections": v29
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": v29
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
                          v7
                        ]
                      },
                      v2,
                      v6,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": [
                          v3,
                          v4,
                          v2,
                          v6,
                          v30,
                          v31,
                          v32,
                          v33,
                          v35
                        ]
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
                              v3,
                              v2,
                              v6,
                              v30,
                              v31,
                              v32,
                              v33,
                              v35
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
                                  v6,
                                  v2
                                ]
                              }
                            ]
                          },
                          v2,
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
                                      v18,
                                      v3,
                                      v13,
                                      v14,
                                      v15,
                                      v16,
                                      v17,
                                      v12,
                                      v2,
                                      v19,
                                      v21,
                                      v23,
                                      v25,
                                      v26,
                                      v4,
                                      v28
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
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "cover_image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": v34
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
                          v9,
                          v2
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
                                "selections": v27
                              }
                            ]
                          }
                        ]
                      },
                      v28
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
            "args": [
              {
                "kind": "Variable",
                "name": "after",
                "variableName": "cursor",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "first",
                "variableName": "count",
                "type": "Int"
              }
            ],
            "handle": "connection",
            "key": "Fair_shows",
            "filters": null
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '21f76737f5ce9859445a5f9a15e41c99';
export default node;
