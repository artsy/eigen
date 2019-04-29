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
    __id: id
  }
}

fragment FairDetail_fair_1G22uz on Fair {
  ...FairHeader_fair
  gravityID
  internalID
  name
  hours
  isActive
  location {
    ...LocationMap_location
    coordinates {
      lat
      lng
    }
    __id: id
  }
  organizer {
    website
  }
  about
  ticketsLink
  profile {
    name
    __id: id
  }
  sponsoredContent {
    activationText
    pressReleaseUrl
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
        gravityID
        internalID
        artworks_connection(first: 4) {
          edges {
            node {
              gravityID
              __id: id
            }
          }
        }
        ...FairBoothPreview_show
        __id: id
        __typename
      }
    }
  }
  __id: id
}

fragment FairHeader_fair on Fair {
  gravityID
  internalID
  name
  formattedOpeningHours
  counts {
    artists
    partners
  }
  followed_content {
    artists {
      name
      href
      gravityID
      internalID
      __id: id
    }
    galleries {
      internalID
      name
      __id: id
    }
  }
  partner_names: shows_connection(first: 2) {
    edges {
      node {
        gravityID
        partner {
          __typename
          ... on Partner {
            profile {
              name
              gravityID
              internalID
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
        __id: id
      }
    }
  }
  artists_names: artists(first: 3) {
    edges {
      node {
        name
        href
        gravityID
        internalID
        __id: id
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
      gravityID
      href
      height
      width
      url(version: "square140")
    }
    id
    gravityID
    name
    is_followed
    __id: id
  }
  start_at
  end_at
  exhibition_period
  __id: id
}

fragment LocationMap_location on Location {
  id
  gravityID
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
  __id: id
}

fragment FairBoothPreview_show on Show {
  gravityID
  internalID
  name
  is_fair_booth
  counts {
    artworks
  }
  partner {
    __typename
    ... on Partner {
      name
      href
      gravityID
      internalID
      id
      profile {
        internalID
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
  fair {
    name
    __id: id
  }
  cover_image {
    url
  }
  location {
    display
    __id: id
  }
  artworks_connection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        __id: id
      }
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v7 = [
  v4,
  v5,
  v3,
  v6,
  v2
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
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
  "name": "url",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "hours",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v16 = [
  v15
],
v17 = [
  v4,
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairDetailShowsQuery",
  "id": null,
  "text": "query FairDetailShowsQuery(\n  $id: String!\n  $count: Int!\n  $cursor: String\n) {\n  fair(id: $id) {\n    ...FairDetail_fair_1G22uz\n    __id: id\n  }\n}\n\nfragment FairDetail_fair_1G22uz on Fair {\n  ...FairHeader_fair\n  gravityID\n  internalID\n  name\n  hours\n  isActive\n  location {\n    ...LocationMap_location\n    coordinates {\n      lat\n      lng\n    }\n    __id: id\n  }\n  organizer {\n    website\n  }\n  about\n  ticketsLink\n  profile {\n    name\n    __id: id\n  }\n  sponsoredContent {\n    activationText\n    pressReleaseUrl\n  }\n  shows: shows_connection(first: $count, after: $cursor) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        gravityID\n        internalID\n        artworks_connection(first: 4) {\n          edges {\n            node {\n              gravityID\n              __id: id\n            }\n          }\n        }\n        ...FairBoothPreview_show\n        __id: id\n        __typename\n      }\n    }\n  }\n  __id: id\n}\n\nfragment FairHeader_fair on Fair {\n  gravityID\n  internalID\n  name\n  formattedOpeningHours\n  counts {\n    artists\n    partners\n  }\n  followed_content {\n    artists {\n      name\n      href\n      gravityID\n      internalID\n      __id: id\n    }\n    galleries {\n      internalID\n      name\n      __id: id\n    }\n  }\n  partner_names: shows_connection(first: 2) {\n    edges {\n      node {\n        gravityID\n        partner {\n          __typename\n          ... on Partner {\n            profile {\n              name\n              gravityID\n              internalID\n              __id: id\n            }\n          }\n          ... on Node {\n            __id: id\n          }\n          ... on ExternalPartner {\n            __id: id\n          }\n        }\n        __id: id\n      }\n    }\n  }\n  artists_names: artists(first: 3) {\n    edges {\n      node {\n        name\n        href\n        gravityID\n        internalID\n        __id: id\n      }\n    }\n  }\n  image {\n    image_url\n    aspect_ratio\n    url\n  }\n  profile {\n    icon {\n      gravityID\n      href\n      height\n      width\n      url(version: \"square140\")\n    }\n    id\n    gravityID\n    name\n    is_followed\n    __id: id\n  }\n  start_at\n  end_at\n  exhibition_period\n  __id: id\n}\n\nfragment LocationMap_location on Location {\n  id\n  gravityID\n  city\n  address\n  address_2\n  postal_code\n  summary\n  coordinates {\n    lat\n    lng\n  }\n  day_schedules {\n    start_time\n    end_time\n    day_of_week\n  }\n  openingHours {\n    __typename\n    ... on OpeningHoursArray {\n      schedules {\n        days\n        hours\n      }\n    }\n    ... on OpeningHoursText {\n      text\n    }\n  }\n  __id: id\n}\n\nfragment FairBoothPreview_show on Show {\n  gravityID\n  internalID\n  name\n  is_fair_booth\n  counts {\n    artworks\n  }\n  partner {\n    __typename\n    ... on Partner {\n      name\n      href\n      gravityID\n      internalID\n      id\n      profile {\n        internalID\n        is_followed\n        __id: id\n      }\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  fair {\n    name\n    __id: id\n  }\n  cover_image {\n    url\n  }\n  location {\n    display\n    __id: id\n  }\n  artworks_connection(first: 4) {\n    edges {\n      node {\n        ...GenericGrid_artworks\n        __id: id\n      }\n    }\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "end_at",
            "args": null,
            "storageKey": null
          },
          v3,
          v4,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "formattedOpeningHours",
            "args": null,
            "storageKey": null
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
            "alias": null,
            "name": "followed_content",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowedContent",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artists",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": v7
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "galleries",
                "storageKey": null,
                "args": null,
                "concreteType": "Partner",
                "plural": true,
                "selections": [
                  v6,
                  v4,
                  v2
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "partner_names",
            "name": "shows_connection",
            "storageKey": "shows_connection(first:2)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2,
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
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          v8,
                          v2,
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
                                "selections": [
                                  v4,
                                  v3,
                                  v6,
                                  v2
                                ]
                              }
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
            "alias": "artists_names",
            "name": "artists",
            "storageKey": "artists(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3,
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
                    "selections": v7
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
              v9,
              v10
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
                  v3,
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "square140",
                        "type": "[String]"
                      }
                    ],
                    "storageKey": "url(version:\"square140\")"
                  }
                ]
              },
              v11,
              v3,
              v4,
              v12,
              v2
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "start_at",
            "args": null,
            "storageKey": null
          },
          v6,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "exhibition_period",
            "args": null,
            "storageKey": null
          },
          v2,
          v13,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isActive",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "postal_code",
                "args": null,
                "storageKey": null
              },
              v11,
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
              v3,
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
                  v8,
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
                          v13
                        ]
                      }
                    ]
                  }
                ]
              },
              v2
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
            "alias": null,
            "name": "sponsoredContent",
            "storageKey": null,
            "args": null,
            "concreteType": "FairSponsoredContent",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "activationText",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "pressReleaseUrl",
                "args": null,
                "storageKey": null
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
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          v8,
                          v2,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              v4,
                              v5,
                              v3,
                              v6,
                              v11,
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "profile",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Profile",
                                "plural": false,
                                "selections": [
                                  v6,
                                  v12,
                                  v2
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v3,
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
                                  v3,
                                  v11,
                                  {
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
                                  v2,
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
                                      v14,
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
                                        "selections": v16
                                      },
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "current_bid",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkCurrentBid",
                                        "plural": false,
                                        "selections": v16
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
                                          v14,
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
                                    "selections": v17
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "partner",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "plural": false,
                                    "selections": v17
                                  },
                                  v5
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v4,
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
                      v6,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "fair",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Fair",
                        "plural": false,
                        "selections": v17
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
                          v10
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
                          v15,
                          v2
                        ]
                      },
                      v2,
                      v8
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
