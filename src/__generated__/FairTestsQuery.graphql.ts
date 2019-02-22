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
  __id
  ...FairDetail_fair
  organizer {
    website
  }
  about
  ticketsLink
}

fragment FairDetail_fair on Fair {
  ...FairHeader_fair
  id
  name
  hours
  location {
    ...LocationMap_location
    coordinates {
      lat
      lng
    }
    __id
  }
  organizer {
    website
  }
  about
  ticketsLink
  profile {
    name
    __id
  }
  shows: shows_connection(first: 5) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        artworks_connection(first: 4) {
          edges {
            node {
              id
              __id
            }
          }
        }
        ...FairBoothPreview_show
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
  counts {
    artists
    partners
  }
  partner_names: shows_connection(first: 2) {
    edges {
      node {
        id
        partner {
          __typename
          ... on Partner {
            profile {
              name
              __id
            }
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
    }
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
    __id
    id
    name
    is_followed
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
}

fragment FairBoothPreview_show on Show {
  id
  name
  is_fair_booth
  partner {
    __typename
    ... on Partner {
      name
      href
      id
      __id
      profile {
        _id
        is_followed
        __id
      }
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 2,
    "type": "Int"
  }
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v6 = [
  v3,
  v1
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
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
  "name": "url",
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
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v13 = [
  v12
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairTestsQuery",
  "id": "0a1d9d3b9f220f525185df98d4e31cdb",
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
          v3,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "FairCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artists",
                "args": null,
                "storageKey": null
              },
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
            "alias": "partner_names",
            "name": "shows_connection",
            "storageKey": "shows_connection(first:2)",
            "args": v4,
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
                      v2,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          v5,
                          v1,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "profile",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Profile",
                                "plural": false,
                                "selections": v6
                              }
                            ]
                          }
                        ]
                      },
                      v1
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "artists_names",
            "name": "artists",
            "storageKey": "artists(first:2)",
            "args": v4,
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
                      v3,
                      v7,
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
              v8,
              v9
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
                  v7,
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
                  v9
                ]
              },
              v1,
              v2,
              v3,
              v10
            ]
          },
          v1,
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
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "organizer",
            "storageKey": null,
            "args": null,
            "concreteType": "organizer",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "website",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "about",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ticketsLink",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "shows",
            "name": "shows_connection",
            "storageKey": "shows_connection(first:5)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 5,
                "type": "Int"
              }
            ],
            "concreteType": "ShowConnection",
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
                "concreteType": "ShowEdge",
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
                    "concreteType": "Show",
                    "plural": false,
                    "selections": [
                      v2,
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
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "is_biddable",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  v2,
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
                                  v1,
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
                                      v11,
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
                                        "selections": v13
                                      },
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "current_bid",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkCurrentBid",
                                        "plural": false,
                                        "selections": v13
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
                                          v11,
                                          v1
                                        ]
                                      },
                                      v1
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
                                    "selections": v6
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "partner",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "plural": false,
                                    "selections": v6
                                  },
                                  v7
                                ]
                              }
                            ]
                          }
                        ]
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
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          v5,
                          v1,
                          {
                            "kind": "InlineFragment",
                            "type": "ExternalPartner",
                            "selections": [
                              v3
                            ]
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              v3,
                              v7,
                              v2,
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
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "_id",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  v10,
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
                        "name": "fair",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Fair",
                        "plural": false,
                        "selections": v6
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
                          v9
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
                          v12,
                          v1
                        ]
                      },
                      v1,
                      v5
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
                "kind": "Literal",
                "name": "first",
                "value": 5,
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
(node as any).hash = '83528fc8901e5c899aaa0f2736501c16';
export default node;
