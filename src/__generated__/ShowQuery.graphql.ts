/* tslint:disable */
/* eslint-disable */
/* @relayHash 32b6c0cb695142509ace9c7c2ae4f572 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowQueryVariables = {
    showID: string;
};
export type ShowQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show_show">;
    } | null;
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
    id
  }
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

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
  saleArtwork {
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment Detail_show on Show {
  internalID
  slug
  description
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
    id
  }
  artistsWithoutArtworks {
    slug
    id
  }
  counts {
    artworks
    artists
  }
  partner {
    __typename
    ... on Partner {
      name
      type
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address_2: address2
  postal_code: postalCode
  summary
  coordinates {
    lat
    lng
  }
  day_schedules: daySchedules {
    start_time: startTime
    end_time: endTime
    day_of_week: dayOfWeek
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

fragment ShowArtistsPreview_show on Show {
  internalID
  slug
  artists {
    id
    internalID
    slug
    href
    ...ArtistListItem_artist
  }
  artists_without_artworks: artistsWithoutArtworks {
    id
    internalID
    slug
    href
    ...ArtistListItem_artist
  }
}

fragment ShowArtworksPreview_show on Show {
  id
  counts {
    artworks
  }
  artworks: artworksConnection(first: 6) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
  }
}

fragment ShowHeader_show on Show {
  slug
  internalID
  id
  name
  is_followed: isFollowed
  end_at: endAt
  exhibition_period: exhibitionPeriod
  isStubShow
  partner {
    __typename
    ... on Partner {
      name
      slug
      href
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  coverImage {
    url
    aspect_ratio: aspectRatio
  }
  images {
    url
    aspect_ratio: aspectRatio
  }
  followedArtists: followedArtistsConnection(first: 3) {
    edges {
      node {
        artist {
          name
          href
          slug
          internalID
          id
        }
      }
    }
  }
  artists {
    name
    href
    slug
    internalID
    id
  }
}

fragment ShowItem_show on Show {
  internalID
  slug
  name
  exhibition_period: exhibitionPeriod
  end_at: endAt
  images {
    url
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
}

fragment Show_show on Show {
  ...Detail_show
}

fragment Shows_show on Show {
  nearbyShows: nearbyShowsConnection(first: 20) {
    edges {
      node {
        id
        name
        ...ShowItem_show
      }
    }
  }
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": "end_at",
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": "aspect_ratio",
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v13 = [
  (v11/*: any*/),
  (v12/*: any*/)
],
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
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
v18 = [
  (v11/*: any*/)
],
v19 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v18/*: any*/)
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowQuery",
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
            "name": "Show_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowQuery",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
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
              (v9/*: any*/),
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v10/*: any*/),
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
            "name": "coverImage",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": (v13/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": (v13/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "followedArtists",
            "name": "followedArtistsConnection",
            "storageKey": "followedArtistsConnection(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
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
                          (v5/*: any*/),
                          (v10/*: any*/),
                          (v3/*: any*/),
                          (v2/*: any*/),
                          (v4/*: any*/)
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
              (v5/*: any*/),
              (v10/*: any*/),
              (v3/*: any*/),
              (v2/*: any*/),
              (v4/*: any*/),
              (v14/*: any*/),
              (v6/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v19/*: any*/)
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
            "alias": "artworks",
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
                      (v4/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
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
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
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
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      (v10/*: any*/),
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
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isClosed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
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
                          (v4/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v4/*: any*/)
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
            "alias": "artists_without_artworks",
            "name": "artistsWithoutArtworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v10/*: any*/),
              (v5/*: any*/),
              (v14/*: any*/),
              (v6/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v19/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "nearbyShows",
            "name": "nearbyShowsConnection",
            "storageKey": "nearbyShowsConnection(first:20)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
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
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v8/*: any*/),
                      (v7/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "images",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": true,
                        "selections": (v18/*: any*/)
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
                          (v9/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v5/*: any*/)
                            ]
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
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v2/*: any*/),
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
                "alias": "address_2",
                "name": "address2",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "postal_code",
                "name": "postalCode",
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
                "alias": "day_schedules",
                "name": "daySchedules",
                "storageKey": null,
                "args": null,
                "concreteType": "DaySchedule",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": "start_time",
                    "name": "startTime",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": "end_time",
                    "name": "endTime",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": "day_of_week",
                    "name": "dayOfWeek",
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
                  (v9/*: any*/),
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
                  },
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
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistsWithoutArtworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowQuery",
    "id": "31e47e32bf908f95bd646b49d2b826f5",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '89957ae2c1266a239c15b6ec18350961';
export default node;
