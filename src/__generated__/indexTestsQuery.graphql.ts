/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 71b867f4378f9adb00393c1cc131db26 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type indexTestsQueryVariables = {};
export type indexTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show_show">;
    } | null;
};
export type indexTestsQuery = {
    readonly response: indexTestsQueryResponse;
    readonly variables: indexTestsQueryVariables;
};



/*
query indexTestsQuery {
  show(id: "art-gallery-pure-art-of-design-at-art-gallery-pure") {
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
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
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
    ...HoursCollapsible_location
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
      __isNode: __typename
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

fragment HoursCollapsible_location on Location {
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

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address2
  postalCode
  summary
  coordinates {
    lat
    lng
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
      __isNode: __typename
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
      __isNode: __typename
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
    "kind": "Literal",
    "name": "id",
    "value": "art-gallery-pure-art-of-design-at-art-gallery-pure"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": "is_followed",
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v6 = {
  "alias": "end_at",
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v7 = {
  "alias": "exhibition_period",
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v10 = [
  (v3/*: any*/)
],
v11 = {
  "kind": "InlineFragment",
  "selections": (v10/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v12 = {
  "kind": "InlineFragment",
  "selections": (v10/*: any*/),
  "type": "ExternalPartner",
  "abstractKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v14 = {
  "alias": "aspect_ratio",
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v15 = [
  (v13/*: any*/),
  (v14/*: any*/)
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "initials",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nationality",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "birthday",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deathday",
  "storageKey": null
},
v20 = [
  (v13/*: any*/)
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Show"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "Artist"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v25 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v28 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "Image"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v32 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "PartnerTypes"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "indexTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Show_show"
          }
        ],
        "storageKey": "show(id:\"art-gallery-pure-art-of-design-at-art-gallery-pure\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "indexTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isStubShow",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  }
                ],
                "type": "Partner",
                "abstractKey": null
              },
              (v11/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": (v15/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "images",
            "plural": true,
            "selections": (v15/*: any*/),
            "storageKey": null
          },
          {
            "alias": "followedArtists",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              }
            ],
            "concreteType": "ShowFollowArtistConnection",
            "kind": "LinkedField",
            "name": "followedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowFollowArtistEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ShowFollowArtist",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v9/*: any*/),
                          (v2/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "followedArtistsConnection(first:3)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v9/*: any*/),
              (v2/*: any*/),
              (v1/*: any*/),
              (v3/*: any*/),
              (v16/*: any*/),
              (v5/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v21/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ShowCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artworks",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artists",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "artworks",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 6
              }
            ],
            "concreteType": "ArtworkConnection",
            "kind": "LinkedField",
            "name": "artworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworkEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"large\")"
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "date",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "saleMessage",
                        "storageKey": null
                      },
                      (v2/*: any*/),
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "artistNames",
                        "storageKey": null
                      },
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Sale",
                        "kind": "LinkedField",
                        "name": "sale",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isAuction",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isClosed",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "displayTimelyAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "endAt",
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtworkCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "bidderPositions",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "kind": "LinkedField",
                            "name": "currentBid",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "display",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lotLabel",
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Partner",
                        "kind": "LinkedField",
                        "name": "partner",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "artworksConnection(first:6)"
          },
          {
            "alias": "artists_without_artworks",
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artistsWithoutArtworks",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v9/*: any*/),
              (v4/*: any*/),
              (v16/*: any*/),
              (v5/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v21/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": "nearbyShows",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "nearbyShowsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Show",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v1/*: any*/),
                      (v2/*: any*/),
                      (v7/*: any*/),
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "images",
                        "plural": true,
                        "selections": (v20/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "partner",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v4/*: any*/)
                            ],
                            "type": "Partner",
                            "abstractKey": null
                          },
                          (v11/*: any*/),
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "nearbyShowsConnection(first:20)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "address",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "address2",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "postalCode",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "summary",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "LatLng",
                "kind": "LinkedField",
                "name": "coordinates",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lat",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lng",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "openingHours",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FormattedDaySchedules",
                        "kind": "LinkedField",
                        "name": "schedules",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "days",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "hours",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "OpeningHoursArray",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "text",
                        "storageKey": null
                      }
                    ],
                    "type": "OpeningHoursText",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artistsWithoutArtworks",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "show(id:\"art-gallery-pure-art-of-design-at-art-gallery-pure\")"
      }
    ]
  },
  "params": {
    "id": "71b867f4378f9adb00393c1cc131db26",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "show": (v22/*: any*/),
        "show.artists": (v23/*: any*/),
        "show.artists.birthday": (v24/*: any*/),
        "show.artists.deathday": (v24/*: any*/),
        "show.artists.href": (v24/*: any*/),
        "show.artists.id": (v25/*: any*/),
        "show.artists.image": (v26/*: any*/),
        "show.artists.image.url": (v24/*: any*/),
        "show.artists.initials": (v24/*: any*/),
        "show.artists.internalID": (v25/*: any*/),
        "show.artists.is_followed": (v27/*: any*/),
        "show.artists.name": (v24/*: any*/),
        "show.artists.nationality": (v24/*: any*/),
        "show.artists.slug": (v25/*: any*/),
        "show.artistsWithoutArtworks": (v23/*: any*/),
        "show.artistsWithoutArtworks.id": (v25/*: any*/),
        "show.artistsWithoutArtworks.slug": (v25/*: any*/),
        "show.artists_without_artworks": (v23/*: any*/),
        "show.artists_without_artworks.birthday": (v24/*: any*/),
        "show.artists_without_artworks.deathday": (v24/*: any*/),
        "show.artists_without_artworks.href": (v24/*: any*/),
        "show.artists_without_artworks.id": (v25/*: any*/),
        "show.artists_without_artworks.image": (v26/*: any*/),
        "show.artists_without_artworks.image.url": (v24/*: any*/),
        "show.artists_without_artworks.initials": (v24/*: any*/),
        "show.artists_without_artworks.internalID": (v25/*: any*/),
        "show.artists_without_artworks.is_followed": (v27/*: any*/),
        "show.artists_without_artworks.name": (v24/*: any*/),
        "show.artists_without_artworks.nationality": (v24/*: any*/),
        "show.artists_without_artworks.slug": (v25/*: any*/),
        "show.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConnection"
        },
        "show.artworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdge"
        },
        "show.artworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "show.artworks.edges.node.artistNames": (v24/*: any*/),
        "show.artworks.edges.node.date": (v24/*: any*/),
        "show.artworks.edges.node.href": (v24/*: any*/),
        "show.artworks.edges.node.id": (v25/*: any*/),
        "show.artworks.edges.node.image": (v26/*: any*/),
        "show.artworks.edges.node.image.aspectRatio": (v28/*: any*/),
        "show.artworks.edges.node.image.aspect_ratio": (v28/*: any*/),
        "show.artworks.edges.node.image.url": (v24/*: any*/),
        "show.artworks.edges.node.internalID": (v25/*: any*/),
        "show.artworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "show.artworks.edges.node.partner.id": (v25/*: any*/),
        "show.artworks.edges.node.partner.name": (v24/*: any*/),
        "show.artworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "show.artworks.edges.node.sale.displayTimelyAt": (v24/*: any*/),
        "show.artworks.edges.node.sale.endAt": (v24/*: any*/),
        "show.artworks.edges.node.sale.id": (v25/*: any*/),
        "show.artworks.edges.node.sale.isAuction": (v27/*: any*/),
        "show.artworks.edges.node.sale.isClosed": (v27/*: any*/),
        "show.artworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "show.artworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "show.artworks.edges.node.saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "show.artworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "show.artworks.edges.node.saleArtwork.currentBid.display": (v24/*: any*/),
        "show.artworks.edges.node.saleArtwork.id": (v25/*: any*/),
        "show.artworks.edges.node.saleArtwork.lotLabel": (v24/*: any*/),
        "show.artworks.edges.node.saleMessage": (v24/*: any*/),
        "show.artworks.edges.node.slug": (v25/*: any*/),
        "show.artworks.edges.node.title": (v24/*: any*/),
        "show.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowCounts"
        },
        "show.counts.artists": (v29/*: any*/),
        "show.counts.artworks": (v29/*: any*/),
        "show.coverImage": (v26/*: any*/),
        "show.coverImage.aspect_ratio": (v28/*: any*/),
        "show.coverImage.url": (v24/*: any*/),
        "show.description": (v24/*: any*/),
        "show.end_at": (v24/*: any*/),
        "show.exhibition_period": (v24/*: any*/),
        "show.followedArtists": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowFollowArtistConnection"
        },
        "show.followedArtists.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ShowFollowArtistEdge"
        },
        "show.followedArtists.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowFollowArtist"
        },
        "show.followedArtists.edges.node.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "show.followedArtists.edges.node.artist.href": (v24/*: any*/),
        "show.followedArtists.edges.node.artist.id": (v25/*: any*/),
        "show.followedArtists.edges.node.artist.internalID": (v25/*: any*/),
        "show.followedArtists.edges.node.artist.name": (v24/*: any*/),
        "show.followedArtists.edges.node.artist.slug": (v25/*: any*/),
        "show.id": (v25/*: any*/),
        "show.images": (v30/*: any*/),
        "show.images.aspect_ratio": (v28/*: any*/),
        "show.images.url": (v24/*: any*/),
        "show.internalID": (v25/*: any*/),
        "show.isStubShow": (v27/*: any*/),
        "show.is_followed": (v27/*: any*/),
        "show.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Location"
        },
        "show.location.address": (v24/*: any*/),
        "show.location.address2": (v24/*: any*/),
        "show.location.city": (v24/*: any*/),
        "show.location.coordinates": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "LatLng"
        },
        "show.location.coordinates.lat": (v31/*: any*/),
        "show.location.coordinates.lng": (v31/*: any*/),
        "show.location.id": (v25/*: any*/),
        "show.location.internalID": (v25/*: any*/),
        "show.location.openingHours": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "OpeningHoursUnion"
        },
        "show.location.openingHours.__typename": (v32/*: any*/),
        "show.location.openingHours.schedules": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "FormattedDaySchedules"
        },
        "show.location.openingHours.schedules.days": (v24/*: any*/),
        "show.location.openingHours.schedules.hours": (v24/*: any*/),
        "show.location.openingHours.text": (v24/*: any*/),
        "show.location.postalCode": (v24/*: any*/),
        "show.location.summary": (v24/*: any*/),
        "show.name": (v24/*: any*/),
        "show.nearbyShows": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowConnection"
        },
        "show.nearbyShows.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ShowEdge"
        },
        "show.nearbyShows.edges.node": (v22/*: any*/),
        "show.nearbyShows.edges.node.end_at": (v24/*: any*/),
        "show.nearbyShows.edges.node.exhibition_period": (v24/*: any*/),
        "show.nearbyShows.edges.node.id": (v25/*: any*/),
        "show.nearbyShows.edges.node.images": (v30/*: any*/),
        "show.nearbyShows.edges.node.images.url": (v24/*: any*/),
        "show.nearbyShows.edges.node.internalID": (v25/*: any*/),
        "show.nearbyShows.edges.node.name": (v24/*: any*/),
        "show.nearbyShows.edges.node.partner": (v33/*: any*/),
        "show.nearbyShows.edges.node.partner.__isNode": (v32/*: any*/),
        "show.nearbyShows.edges.node.partner.__typename": (v32/*: any*/),
        "show.nearbyShows.edges.node.partner.id": (v25/*: any*/),
        "show.nearbyShows.edges.node.partner.name": (v24/*: any*/),
        "show.nearbyShows.edges.node.slug": (v25/*: any*/),
        "show.partner": (v33/*: any*/),
        "show.partner.__isNode": (v32/*: any*/),
        "show.partner.__typename": (v32/*: any*/),
        "show.partner.href": (v24/*: any*/),
        "show.partner.id": (v25/*: any*/),
        "show.partner.name": (v24/*: any*/),
        "show.partner.slug": (v25/*: any*/),
        "show.partner.type": (v24/*: any*/),
        "show.slug": (v25/*: any*/)
      }
    },
    "name": "indexTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'baf5f27641a422a7a115fcbf752997ff';
export default node;
