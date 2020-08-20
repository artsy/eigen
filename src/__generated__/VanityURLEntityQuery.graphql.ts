/* tslint:disable */
/* eslint-disable */
/* @relayHash 51e8f9c4cef123ce2c32aaca9b6ffe3e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntityQueryVariables = {
    id: string;
};
export type VanityURLEntityQueryResponse = {
    readonly vanityURLEntity: {
        readonly " $fragmentRefs": FragmentRefs<"VanityURLEntity_fairOrPartner">;
    } | null;
};
export type VanityURLEntityQuery = {
    readonly response: VanityURLEntityQueryResponse;
    readonly variables: VanityURLEntityQueryVariables;
};



/*
query VanityURLEntityQuery(
  $id: String!
) {
  vanityURLEntity(id: $id) {
    __typename
    ...VanityURLEntity_fairOrPartner
    ... on Node {
      id
    }
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

fragment FairBoothPreview_show on Show {
  slug
  internalID
  counts {
    artworks
  }
  partner {
    __typename
    ... on Partner {
      name
      href
      slug
      internalID
      id
      profile {
        id
        slug
        internalID
        isFollowed
      }
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
  }
  location {
    display
    id
  }
  artworks: artworksConnection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
  }
}

fragment FairDetail_fair on Fair {
  ...FairHeader_fair
  slug
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
    id
  }
  organizer {
    website
    id
  }
  profile {
    name
    id
  }
  sponsoredContent {
    pressReleaseUrl
    activationText
  }
  shows: showsConnection(first: 5) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        artworks: artworksConnection(first: 4) {
          edges {
            node {
              slug
              id
            }
          }
        }
        ...FairBoothPreview_show
        id
        __typename
      }
    }
  }
}

fragment FairHeader_fair on Fair {
  slug
  name
  formattedOpeningHours
  startAt
  endAt
  exhibitionPeriod
  counts {
    artists
  }
  image {
    url
  }
  followedContent {
    artists {
      name
      href
      slug
      internalID
      id
    }
  }
  artistsConnection(first: 3) {
    edges {
      node {
        name
        href
        slug
        internalID
        id
      }
    }
  }
  profile {
    id
    icon {
      url(version: "square140")
    }
  }
}

fragment Fair_fair on Fair {
  id
  ...FairDetail_fair
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      id
    }
  }
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

fragment PartnerArtwork_partner on Partner {
  internalID
  artworks: artworksConnection(sort: PARTNER_UPDATED_AT_DESC, first: 10) {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment PartnerFollowButton_partner on Partner {
  internalID
  slug
  profile {
    id
    internalID
    isFollowed
  }
}

fragment PartnerHeader_partner on Partner {
  name
  profile {
    name
    id
  }
  counts {
    eligibleArtworks
  }
  ...PartnerFollowButton_partner
}

fragment PartnerLocationSection_partner on Partner {
  slug
  name
  cities
  locations: locationsConnection(first: 0) {
    totalCount
  }
}

fragment PartnerOverview_partner on Partner {
  internalID
  name
  cities
  profile {
    bio
    id
  }
  artists: artistsConnection(sort: SORTABLE_ID_ASC, first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        ...ArtistListItem_artist
        counts {
          artworks
        }
        __typename
      }
      cursor
      id
    }
  }
  ...PartnerLocationSection_partner
}

fragment PartnerShowRailItem_show on Show {
  internalID
  slug
  name
  exhibitionPeriod
  endAt
  coverImage {
    url
  }
  images {
    url
  }
}

fragment PartnerShowsRail_partner on Partner {
  internalID
  currentAndUpcomingShows: showsConnection(status: CURRENT, sort: END_AT_ASC, first: 6) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        internalID
        slug
        name
        exhibitionPeriod
        endAt
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
        ...PartnerShowRailItem_show
        __typename
      }
      cursor
    }
  }
}

fragment PartnerShows_partner on Partner {
  slug
  internalID
  recentShows: showsConnection(status: CURRENT, first: 10) {
    edges {
      node {
        id
        isDisplayable
      }
    }
  }
  pastShows: showsConnection(status: CLOSED, sort: END_AT_DESC, first: 32) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        name
        slug
        exhibitionPeriod
        coverImage {
          url
          aspectRatio
        }
        href
        __typename
      }
      cursor
    }
  }
  ...PartnerShowsRail_partner
}

fragment Partner_partner on Partner {
  id
  internalID
  slug
  profile {
    id
    isFollowed
    internalID
  }
  ...PartnerArtwork_partner
  ...PartnerOverview_partner
  ...PartnerShows_partner
  ...PartnerHeader_partner
}

fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
  ... on Fair {
    __typename
    ...Fair_fair
  }
  ... on Partner {
    __typename
    ...Partner_partner
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
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
  "name": "slug",
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
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
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
v9 = [
  (v8/*: any*/)
],
v10 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v9/*: any*/)
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v13 = [
  (v5/*: any*/),
  (v11/*: any*/),
  (v4/*: any*/),
  (v12/*: any*/),
  (v3/*: any*/)
],
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "hours",
  "args": null,
  "storageKey": null
},
v15 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
],
v16 = {
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
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v18 = {
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
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
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
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v24 = {
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
    (v3/*: any*/)
  ]
},
v25 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v26 = {
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
        (v25/*: any*/)
      ]
    },
    (v3/*: any*/)
  ]
},
v27 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    (v3/*: any*/)
  ]
},
v28 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "artworks",
    "args": null,
    "storageKey": null
  }
],
v29 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v30 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v9/*: any*/)
},
v31 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v32 = [
  (v31/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "PARTNER_UPDATED_AT_DESC"
  }
],
v33 = [
  "sort"
],
v34 = [
  (v31/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "SORTABLE_ID_ASC"
  }
],
v35 = {
  "kind": "Literal",
  "name": "status",
  "value": "CURRENT"
},
v36 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDisplayable",
  "args": null,
  "storageKey": null
},
v37 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 32
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_DESC"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "CLOSED"
  }
],
v38 = [
  "status",
  "sort"
],
v39 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_ASC"
  },
  (v35/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "VanityURLEntityQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "vanityURLEntity",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "VanityURLEntity_fairOrPartner",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "VanityURLEntityQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "vanityURLEntity",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "Fair",
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "formattedOpeningHours",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "startAt",
                "args": null,
                "storageKey": null
              },
              (v6/*: any*/),
              (v7/*: any*/),
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
                  }
                ]
              },
              (v10/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "followedContent",
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
                    "selections": (v13/*: any*/)
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artistsConnection",
                "storageKey": "artistsConnection(first:3)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
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
                        "selections": (v13/*: any*/)
                      }
                    ]
                  }
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
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "icon",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "square140"
                          }
                        ],
                        "storageKey": "url(version:\"square140\")"
                      }
                    ]
                  },
                  (v5/*: any*/)
                ]
              },
              (v12/*: any*/),
              (v14/*: any*/),
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
                  (v3/*: any*/),
                  (v12/*: any*/),
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
                      (v2/*: any*/),
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
                              (v14/*: any*/)
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
                  },
                  (v3/*: any*/)
                ]
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
                    "name": "pressReleaseUrl",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "activationText",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": "shows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:5)",
                "args": (v15/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": [
                  (v16/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ShowEdge",
                    "plural": true,
                    "selections": [
                      (v17/*: any*/),
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
                            "alias": "artworks",
                            "name": "artworksConnection",
                            "storageKey": "artworksConnection(first:4)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 4
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
                                      (v3/*: any*/),
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
                                            "alias": "aspect_ratio",
                                            "name": "aspectRatio",
                                            "args": null,
                                            "storageKey": null
                                          },
                                          (v18/*: any*/),
                                          (v19/*: any*/)
                                        ]
                                      },
                                      (v20/*: any*/),
                                      (v21/*: any*/),
                                      (v22/*: any*/),
                                      (v12/*: any*/),
                                      (v23/*: any*/),
                                      (v11/*: any*/),
                                      (v24/*: any*/),
                                      (v26/*: any*/),
                                      (v27/*: any*/)
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          (v4/*: any*/),
                          (v12/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "counts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ShowCounts",
                            "plural": false,
                            "selections": (v28/*: any*/)
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v5/*: any*/),
                                  (v11/*: any*/),
                                  (v4/*: any*/),
                                  (v12/*: any*/),
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
                                      (v4/*: any*/),
                                      (v12/*: any*/),
                                      (v29/*: any*/)
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          (v30/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "location",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Location",
                            "plural": false,
                            "selections": [
                              (v25/*: any*/),
                              (v3/*: any*/)
                            ]
                          },
                          (v3/*: any*/),
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "shows",
                "name": "showsConnection",
                "args": (v15/*: any*/),
                "handle": "connection",
                "key": "Fair_shows",
                "filters": null
              }
            ]
          },
          {
            "kind": "InlineFragment",
            "type": "Partner",
            "selections": [
              (v2/*: any*/),
              (v12/*: any*/),
              (v4/*: any*/),
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
                  (v29/*: any*/),
                  (v12/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "bio",
                    "args": null,
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:10,sort:\"PARTNER_UPDATED_AT_DESC\")",
                "args": (v32/*: any*/),
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
                          (v3/*: any*/),
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
                              (v19/*: any*/),
                              (v18/*: any*/)
                            ]
                          },
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          (v12/*: any*/),
                          (v23/*: any*/),
                          (v11/*: any*/),
                          (v24/*: any*/),
                          (v26/*: any*/),
                          (v27/*: any*/),
                          (v2/*: any*/)
                        ]
                      },
                      (v17/*: any*/),
                      (v3/*: any*/)
                    ]
                  },
                  (v16/*: any*/)
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artworks",
                "name": "artworksConnection",
                "args": (v32/*: any*/),
                "handle": "connection",
                "key": "Partner_artworks",
                "filters": (v33/*: any*/)
              },
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cities",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": "artists",
                "name": "artistsConnection",
                "storageKey": "artistsConnection(first:10,sort:\"SORTABLE_ID_ASC\")",
                "args": (v34/*: any*/),
                "concreteType": "ArtistPartnerConnection",
                "plural": false,
                "selections": [
                  (v16/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistPartnerEdge",
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
                          (v3/*: any*/),
                          (v12/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "initials",
                            "args": null,
                            "storageKey": null
                          },
                          (v11/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": "is_followed",
                            "name": "isFollowed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "nationality",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "birthday",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "deathday",
                            "args": null,
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "counts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "plural": false,
                            "selections": (v28/*: any*/)
                          },
                          (v2/*: any*/)
                        ]
                      },
                      (v17/*: any*/),
                      (v3/*: any*/)
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artists",
                "name": "artistsConnection",
                "args": (v34/*: any*/),
                "handle": "connection",
                "key": "Partner_artists",
                "filters": (v33/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": "locations",
                "name": "locationsConnection",
                "storageKey": "locationsConnection(first:0)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 0
                  }
                ],
                "concreteType": "LocationConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "totalCount",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": "recentShows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:10,status:\"CURRENT\")",
                "args": [
                  (v31/*: any*/),
                  (v35/*: any*/)
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
                          (v3/*: any*/),
                          (v36/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": "pastShows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:32,sort:\"END_AT_DESC\",status:\"CLOSED\")",
                "args": (v37/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": [
                  (v16/*: any*/),
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
                          (v36/*: any*/),
                          (v3/*: any*/),
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v7/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "coverImage",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v19/*: any*/)
                            ]
                          },
                          (v11/*: any*/),
                          (v2/*: any*/)
                        ]
                      },
                      (v17/*: any*/)
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "pastShows",
                "name": "showsConnection",
                "args": (v37/*: any*/),
                "handle": "connection",
                "key": "Partner_pastShows",
                "filters": (v38/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": "currentAndUpcomingShows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:6,sort:\"END_AT_ASC\",status:\"CURRENT\")",
                "args": (v39/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": [
                  (v16/*: any*/),
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
                          (v36/*: any*/),
                          (v3/*: any*/),
                          (v12/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v7/*: any*/),
                          (v6/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "images",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": true,
                            "selections": (v9/*: any*/)
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v5/*: any*/)
                                ]
                              }
                            ]
                          },
                          (v30/*: any*/),
                          (v2/*: any*/)
                        ]
                      },
                      (v17/*: any*/)
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "currentAndUpcomingShows",
                "name": "showsConnection",
                "args": (v39/*: any*/),
                "handle": "connection",
                "key": "Partner_currentAndUpcomingShows",
                "filters": (v38/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "counts",
                "storageKey": null,
                "args": null,
                "concreteType": "PartnerCounts",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "eligibleArtworks",
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
  "params": {
    "operationKind": "query",
    "name": "VanityURLEntityQuery",
    "id": "238316efdc927b0ce77c62b7050e01e0",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '345c641dc3f2ba52a22786a800cb6439';
export default node;
