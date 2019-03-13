/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Show_show$ref } from "./Show_show.graphql";
export type ShowQueryVariables = {
    readonly showID: string;
};
export type ShowQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": Show_show$ref;
    }) | null;
};
export type ShowQuery = {
    readonly response: ShowQueryResponse;
    readonly variables: ShowQueryVariables;
};



/*
query ShowQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show_show
    __id
  }
}

fragment Show_show on Show {
  ...Detail_show
  ...MoreInfo_show
  ...ShowArtists_show
  ...ShowArtworks_show
  __id
}

fragment Detail_show on Show {
  _id
  id
  name
  description
  city
  is_local_discovery
  images {
    id
  }
  ...ShowHeader_show
  ...ShowArtworksPreview_show
  ...ShowArtistsPreview_show
  ...Shows_show
  location {
    ...LocationMap_location
    __id
  }
  counts {
    artworks
  }
  status
  partner {
    __typename
    ... on Partner {
      name
      type
    }
    ... on Node {
      __id
    }
    ... on ExternalPartner {
      __id
    }
  }
  __id
}

fragment MoreInfo_show on Show {
  _id
  id
  exhibition_period
  partner {
    __typename
    ... on Partner {
      website
      type
    }
    ... on Node {
      __id
    }
    ... on ExternalPartner {
      __id
    }
  }
  press_release
  events {
    ...EventSection_event
  }
  __id
}

fragment ShowArtists_show on Show {
  _id
  id
  artists_grouped_by_name {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id
      href
      __id
    }
  }
  __id
}

fragment ShowArtworks_show on Show {
  __id
  id
  _id
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

fragment ArtistListItem_artist on Artist {
  __id
  _id
  id
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment EventSection_event on PartnerShowEventType {
  event_type
  description
  exhibitionPeriod
}

fragment ShowHeader_show on Show {
  id
  _id
  __id
  name
  press_release
  is_followed
  exhibition_period
  status
  isStubShow
  partner {
    __typename
    ... on Partner {
      name
      id
      href
    }
    ... on Node {
      __id
    }
    ... on ExternalPartner {
      __id
    }
  }
  images {
    url
    aspect_ratio
  }
  followedArtists(first: 3) {
    edges {
      node {
        artist {
          name
          href
          id
          _id
          __id
        }
      }
    }
  }
  artists {
    name
    href
    id
    _id
    __id
  }
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
  _id
  id
  artists {
    _id
    id
    href
    ...ArtistListItem_artist
    __id
  }
  __id
}

fragment Shows_show on Show {
  nearbyShows(first: 20) {
    edges {
      node {
        ...ShowItem_show
        __id
      }
    }
  }
  __id
}

fragment LocationMap_location on Location {
  __id
  id
  city
  address
  address_2
  postal_code
  summary
  coordinates {
    lat
    lng
  }
  day_schedules {
    start_time
    end_time
    day_of_week
  }
  openingHours {
    __typename
    ... on OpeningHoursArray {
      schedules {
        days
        hours
      }
    }
    ... on OpeningHoursText {
      text
    }
  }
}

fragment ShowItem_show on Show {
  _id
  id
  name
  exhibition_period
  images {
    url
    aspect_ratio
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on Node {
      __id
    }
    ... on ExternalPartner {
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
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
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
  "name": "description",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "city",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspect_ratio",
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
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    v8
  ]
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    v9,
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
v20 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v21 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v22 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "sale_message",
  "args": null,
  "storageKey": null
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_in_auction",
  "args": null,
  "storageKey": null
},
v24 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v25 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_offerable",
  "args": null,
  "storageKey": null
},
v26 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v27 = {
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
    v26,
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
v28 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v29 = {
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
      "selections": v28
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": v28
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
        v26,
        v2
      ]
    },
    v2
  ]
},
v30 = [
  v4,
  v2
],
v31 = {
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
  "selections": v30
},
v32 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v30
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ShowQuery",
  "id": "b451c44ea24b73309f16cf63e3682d9a",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowQuery",
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
            "name": "Show_show",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowQuery",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
          v3,
          v4,
          v5,
          v6,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_local_discovery",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              v7,
              v8,
              v9
            ]
          },
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "press_release",
            "args": null,
            "storageKey": null
          },
          v10,
          v11,
          v7,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isStubShow",
            "args": null,
            "storageKey": null
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
              v12,
              v2,
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  v4,
                  v7,
                  v13,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "type",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "website",
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
            "name": "followedArtists",
            "storageKey": "followedArtists(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3,
                "type": "Int"
              }
            ],
            "concreteType": "ShowFollowArtistConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowFollowArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ShowFollowArtist",
                    "plural": false,
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
                          v4,
                          v13,
                          v7,
                          v3,
                          v2
                        ]
                      }
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
            "selections": [
              v4,
              v13,
              v7,
              v3,
              v2,
              v10,
              v14,
              v15,
              v16,
              v17
            ]
          },
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
              v18,
              v2,
              v19,
              v20,
              v21,
              v22,
              v23,
              v7,
              v24,
              v25,
              v27,
              v29,
              v31,
              v32,
              v13
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
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "nearbyShows",
            "storageKey": "nearbyShows(first:20)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20,
                "type": "Int"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Show",
                    "plural": false,
                    "selections": [
                      v3,
                      v7,
                      v4,
                      v11,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "images",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": true,
                        "selections": [
                          v8,
                          v9
                        ]
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
                          v12,
                          v2,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              v4
                            ]
                          }
                        ]
                      },
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
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              v2,
              v7,
              v6,
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "postal_code",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "summary",
                "args": null,
                "storageKey": null
              },
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
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "openingHours",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  v12,
                  {
                    "kind": "InlineFragment",
                    "type": "OpeningHoursText",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "text",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "OpeningHoursArray",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "schedules",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FormattedDaySchedules",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "days",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "hours",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "events",
            "storageKey": null,
            "args": null,
            "concreteType": "PartnerShowEventType",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "event_type",
                "args": null,
                "storageKey": null
              },
              v5,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "exhibitionPeriod",
                "args": null,
                "storageKey": null
              }
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
                  v14,
                  v2,
                  v7,
                  v4,
                  v10,
                  v3,
                  v15,
                  v16,
                  v17,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "sortable_id",
                    "args": null,
                    "storageKey": null
                  },
                  v13
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
                      v7,
                      v4,
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
                          v24,
                          v7,
                          v19,
                          v20,
                          v21,
                          v22,
                          v23,
                          v18,
                          v2,
                          v25,
                          v27,
                          v29,
                          v31,
                          v32,
                          v13,
                          v12
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
(node as any).hash = '89957ae2c1266a239c15b6ec18350961';
export default node;
