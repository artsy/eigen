/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Show_show$ref } from "./Show_show.graphql";
export type QueryRenderersShowQueryVariables = {
    readonly showID: string;
};
export type QueryRenderersShowQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": Show_show$ref;
    }) | null;
};
export type QueryRenderersShowQuery = {
    readonly response: QueryRenderersShowQueryResponse;
    readonly variables: QueryRenderersShowQueryVariables;
};



/*
query QueryRenderersShowQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show_show
    __id: id
  }
}

fragment Show_show on Show {
  ...Detail_show
  __id: id
}

fragment Detail_show on Show {
  internalID
  gravityID
  name
  description
  city
  is_local_discovery
  images {
    gravityID
  }
  ...ShowHeader_show
  ...ShowArtworksPreview_show
  ...ShowArtistsPreview_show
  ...Shows_show
  location {
    ...LocationMap_location
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
  artists_without_artworks {
    gravityID
    __id: id
  }
  counts {
    artworks
    artists
  }
  status
  partner {
    __typename
    ... on Partner {
      name
      type
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

fragment ShowHeader_show on Show {
  gravityID
  internalID
  id
  name
  press_release
  is_followed
  end_at
  exhibition_period
  status
  isStubShow
  partner {
    __typename
    ... on Partner {
      name
      gravityID
      href
    }
    ... on Node {
      __id: id
    }
    ... on ExternalPartner {
      __id: id
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
          gravityID
          internalID
          __id: id
        }
      }
    }
  }
  artists {
    name
    href
    gravityID
    internalID
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

fragment Shows_show on Show {
  nearbyShows(first: 20) {
    edges {
      node {
        id
        ...ShowItem_show
        __id: id
      }
    }
  }
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

fragment ShowItem_show on Show {
  internalID
  gravityID
  name
  exhibition_period
  end_at
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
      __id: id
    }
    ... on ExternalPartner {
      __id: id
    }
  }
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
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
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
  "name": "city",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "end_at",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v18 = {
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
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v20 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v21 = [
  v5,
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersShowQuery",
  "id": null,
  "text": "query QueryRenderersShowQuery(\n  $showID: String!\n) {\n  show(id: $showID) {\n    ...Show_show\n    __id: id\n  }\n}\n\nfragment Show_show on Show {\n  ...Detail_show\n  __id: id\n}\n\nfragment Detail_show on Show {\n  internalID\n  gravityID\n  name\n  description\n  city\n  is_local_discovery\n  images {\n    gravityID\n  }\n  ...ShowHeader_show\n  ...ShowArtworksPreview_show\n  ...ShowArtistsPreview_show\n  ...Shows_show\n  location {\n    ...LocationMap_location\n    openingHours {\n      __typename\n      ... on OpeningHoursArray {\n        schedules {\n          days\n          hours\n        }\n      }\n      ... on OpeningHoursText {\n        text\n      }\n    }\n    __id: id\n  }\n  artists_without_artworks {\n    gravityID\n    __id: id\n  }\n  counts {\n    artworks\n    artists\n  }\n  status\n  partner {\n    __typename\n    ... on Partner {\n      name\n      type\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment ShowHeader_show on Show {\n  gravityID\n  internalID\n  id\n  name\n  press_release\n  is_followed\n  end_at\n  exhibition_period\n  status\n  isStubShow\n  partner {\n    __typename\n    ... on Partner {\n      name\n      gravityID\n      href\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  images {\n    url\n    aspect_ratio\n  }\n  followedArtists(first: 3) {\n    edges {\n      node {\n        artist {\n          name\n          href\n          gravityID\n          internalID\n          __id: id\n        }\n      }\n    }\n  }\n  artists {\n    name\n    href\n    gravityID\n    internalID\n    __id: id\n  }\n  __id: id\n}\n\nfragment ShowArtworksPreview_show on Show {\n  id\n  artworks(size: 6) {\n    ...GenericGrid_artworks\n    __id: id\n  }\n  counts {\n    artworks\n  }\n  __id: id\n}\n\nfragment ShowArtistsPreview_show on Show {\n  internalID\n  gravityID\n  artists {\n    internalID\n    gravityID\n    href\n    ...ArtistListItem_artist\n    __id: id\n  }\n  artists_without_artworks {\n    internalID\n    gravityID\n    href\n    ...ArtistListItem_artist\n    __id: id\n  }\n  __id: id\n}\n\nfragment Shows_show on Show {\n  nearbyShows(first: 20) {\n    edges {\n      node {\n        id\n        ...ShowItem_show\n        __id: id\n      }\n    }\n  }\n  __id: id\n}\n\nfragment LocationMap_location on Location {\n  id\n  gravityID\n  city\n  address\n  address_2\n  postal_code\n  summary\n  coordinates {\n    lat\n    lng\n  }\n  day_schedules {\n    start_time\n    end_time\n    day_of_week\n  }\n  openingHours {\n    __typename\n    ... on OpeningHoursArray {\n      schedules {\n        days\n        hours\n      }\n    }\n    ... on OpeningHoursText {\n      text\n    }\n  }\n  __id: id\n}\n\nfragment ShowItem_show on Show {\n  internalID\n  gravityID\n  name\n  exhibition_period\n  end_at\n  images {\n    url\n    aspect_ratio\n  }\n  partner {\n    __typename\n    ... on Partner {\n      name\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment ArtistListItem_artist on Artist {\n  id\n  internalID\n  gravityID\n  name\n  is_followed\n  nationality\n  birthday\n  deathday\n  image {\n    url\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersShowQuery",
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
    "name": "QueryRenderersShowQuery",
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
          v3,
          v4,
          v5,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
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
          v10,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "press_release",
            "args": null,
            "storageKey": null
          },
          v11,
          v12,
          v7,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
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
              v13,
              v2,
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  v5,
                  v7,
                  v14,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "type",
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
                          v5,
                          v14,
                          v7,
                          v4,
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
              v10,
              v5,
              v7,
              v4,
              v2,
              v14,
              v11,
              v15,
              v16,
              v17,
              v18
            ]
          },
          v2,
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_acquireable",
                "args": null,
                "storageKey": null
              },
              v10,
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_biddable",
                "args": null,
                "storageKey": null
              },
              v7,
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
                  v19,
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
                    "selections": v20
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "current_bid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtworkCurrentBid",
                    "plural": false,
                    "selections": v20
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
                "selections": v21
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "partner",
                "storageKey": null,
                "args": null,
                "concreteType": "Partner",
                "plural": false,
                "selections": v21
              },
              v14,
              v2
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
            "name": "artists_without_artworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              v11,
              v4,
              v14,
              v10,
              v5,
              v7,
              v15,
              v16,
              v17,
              v18,
              v2
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
                      v10,
                      v4,
                      v7,
                      v5,
                      v3,
                      v12,
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
                          v13,
                          v2,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              v5
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "postal_code",
                "args": null,
                "storageKey": null
              },
              v10,
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
              v7,
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
                  v13,
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
              },
              v2
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '673a9098896e4777f88f0902608774eb';
export default node;
