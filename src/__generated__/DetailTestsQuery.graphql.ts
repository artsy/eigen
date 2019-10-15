/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Detail_show$ref } from "./Detail_show.graphql";
export type DetailTestsQueryVariables = {};
export type DetailTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": Detail_show$ref;
    } | null;
};
export type DetailTestsQueryRawResponse = {
    readonly show: ({
        readonly internalID: string;
        readonly slug: string;
        readonly description: string | null;
        readonly id: string;
        readonly name: string | null;
        readonly is_followed: boolean | null;
        readonly end_at: string | null;
        readonly exhibition_period: string | null;
        readonly isStubShow: boolean | null;
        readonly partner: ({
            readonly __typename: "Partner";
            readonly id: string | null;
            readonly name: string | null;
            readonly slug: string;
            readonly href: string | null;
            readonly type: string | null;
        } | {
            readonly __typename: string | null;
            readonly id: string | null;
        }) | null;
        readonly images: ReadonlyArray<({
            readonly url: string | null;
            readonly aspect_ratio: number;
        }) | null> | null;
        readonly followedArtists: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly artist: ({
                        readonly name: string | null;
                        readonly href: string | null;
                        readonly slug: string;
                        readonly internalID: string;
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly artists: ReadonlyArray<({
            readonly name: string | null;
            readonly href: string | null;
            readonly slug: string;
            readonly internalID: string;
            readonly id: string | null;
            readonly initials: string | null;
            readonly is_followed: boolean | null;
            readonly nationality: string | null;
            readonly birthday: string | null;
            readonly deathday: string | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly counts: ({
            readonly artworks: number | null;
            readonly artists: number | null;
        }) | null;
        readonly artworks: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly image: ({
                        readonly aspect_ratio: number;
                        readonly url: string | null;
                    }) | null;
                    readonly title: string | null;
                    readonly date: string | null;
                    readonly sale_message: string | null;
                    readonly is_biddable: boolean | null;
                    readonly is_acquireable: boolean | null;
                    readonly is_offerable: boolean | null;
                    readonly slug: string;
                    readonly sale: ({
                        readonly is_auction: boolean | null;
                        readonly is_closed: boolean | null;
                        readonly display_timely_at: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly sale_artwork: ({
                        readonly current_bid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly id: string | null;
                    }) | null;
                    readonly artists: ReadonlyArray<({
                        readonly name: string | null;
                        readonly id: string | null;
                    }) | null> | null;
                    readonly partner: ({
                        readonly name: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly href: string | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly artists_without_artworks: ReadonlyArray<({
            readonly id: string;
            readonly internalID: string;
            readonly slug: string;
            readonly href: string | null;
            readonly name: string | null;
            readonly initials: string | null;
            readonly is_followed: boolean | null;
            readonly nationality: string | null;
            readonly birthday: string | null;
            readonly deathday: string | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly nearbyShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly end_at: string | null;
                    readonly images: ReadonlyArray<({
                        readonly url: string | null;
                    }) | null> | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly location: ({
            readonly id: string;
            readonly internalID: string;
            readonly city: string | null;
            readonly address: string | null;
            readonly address_2: string | null;
            readonly postal_code: string | null;
            readonly summary: string | null;
            readonly coordinates: ({
                readonly lat: number | null;
                readonly lng: number | null;
            }) | null;
            readonly day_schedules: ReadonlyArray<({
                readonly start_time: number | null;
                readonly end_time: number | null;
                readonly day_of_week: string | null;
            }) | null> | null;
            readonly openingHours: ({
                readonly __typename: "OpeningHoursArray";
                readonly schedules: ReadonlyArray<({
                    readonly days: string | null;
                    readonly hours: string | null;
                }) | null> | null;
            } | {
                readonly __typename: "OpeningHoursText";
                readonly text: string | null;
            } | {
                readonly __typename: string | null;
            }) | null;
        }) | null;
        readonly artistsWithoutArtworks: ReadonlyArray<({
            readonly slug: string;
            readonly id: string | null;
        }) | null> | null;
    }) | null;
};
export type DetailTestsQuery = {
    readonly response: DetailTestsQueryResponse;
    readonly variables: DetailTestsQueryVariables;
    readonly rawResponse: DetailTestsQueryRawResponse;
};



/*
query DetailTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...Detail_show
    id
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

fragment Shows_show on Show {
  nearbyShows: nearbyShowsConnection(first: 20) {
    edges {
      node {
        id
        ...ShowItem_show
      }
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

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": "end_at",
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
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
  "name": "href",
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
  "alias": "aspect_ratio",
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "nationality",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "birthday",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "deathday",
  "args": null,
  "storageKey": null
},
v16 = [
  (v10/*: any*/)
],
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v16/*: any*/)
},
v18 = [
  (v4/*: any*/),
  (v3/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "DetailTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Detail_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "DetailTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
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
              (v8/*: any*/),
              (v3/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/),
                  (v9/*: any*/),
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
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              (v10/*: any*/),
              (v11/*: any*/)
            ]
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
                          (v4/*: any*/),
                          (v9/*: any*/),
                          (v2/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/)
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
              (v4/*: any*/),
              (v9/*: any*/),
              (v2/*: any*/),
              (v1/*: any*/),
              (v3/*: any*/),
              (v12/*: any*/),
              (v5/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v17/*: any*/)
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
                          (v11/*: any*/),
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
                        "alias": "sale_message",
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_biddable",
                        "name": "isBiddable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_acquireable",
                        "name": "isAcquireable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_offerable",
                        "name": "isOfferable",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/),
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
                            "alias": "is_auction",
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_closed",
                            "name": "isClosed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "display_timely_at",
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "sale_artwork",
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": "current_bid",
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
                          (v3/*: any*/)
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
                            "value": true
                          }
                        ],
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": (v18/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v18/*: any*/)
                      },
                      (v9/*: any*/)
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
              (v3/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v9/*: any*/),
              (v4/*: any*/),
              (v12/*: any*/),
              (v5/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v17/*: any*/)
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
                      (v3/*: any*/),
                      (v1/*: any*/),
                      (v2/*: any*/),
                      (v4/*: any*/),
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
                        "selections": (v16/*: any*/)
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
                          (v8/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v4/*: any*/)
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
              (v3/*: any*/),
              (v1/*: any*/),
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
                  (v8/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "DetailTestsQuery",
    "id": "eb3334f2f0a392023ea218c814a2a8e3",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '07178d1bfdf29daf3a6fb7cc92e4be1a';
export default node;
