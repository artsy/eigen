/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistTestsQueryVariables = {
    isPad: boolean;
};
export type ArtistTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"Artist_artist">;
    } | null;
};
export type ArtistTestsQueryRawResponse = {
    readonly artist: ({
        readonly internalID: string;
        readonly slug: string;
        readonly has_metadata: boolean | null;
        readonly counts: ({
            readonly artworks: number | null;
            readonly partner_shows: number | null;
            readonly related_artists: number | null;
            readonly articles: number | null;
            readonly follows: number | null;
        }) | null;
        readonly id: string;
        readonly isFollowed: boolean | null;
        readonly name: string | null;
        readonly nationality: string | null;
        readonly birthday: string | null;
        readonly is_display_auction_link: boolean | null;
        readonly bio: string | null;
        readonly blurb: string | null;
        readonly related: ({
            readonly artists: ({
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly id: string;
                        readonly href: string | null;
                        readonly name: string | null;
                        readonly counts: ({
                            readonly forSaleArtworks: number | null;
                            readonly artworks: number | null;
                        }) | null;
                        readonly image: ({
                            readonly url: string | null;
                        }) | null;
                    }) | null;
                }) | null> | null;
            }) | null;
        }) | null;
        readonly articles: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly thumbnail_title: string | null;
                    readonly href: string | null;
                    readonly author: ({
                        readonly name: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly thumbnail_image: ({
                        readonly url: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly currentShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly is_fair_booth: boolean | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly kind: string | null;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly status_update: string | null;
                    readonly status: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly location: ({
                        readonly city: string | null;
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly upcomingShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly is_fair_booth: boolean | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly kind: string | null;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly status_update: string | null;
                    readonly status: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly location: ({
                        readonly city: string | null;
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly artworks: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly image: ({
                        readonly aspectRatio: number;
                        readonly url: string | null;
                        readonly aspect_ratio: number;
                    }) | null;
                    readonly title: string | null;
                    readonly date: string | null;
                    readonly sale_message: string | null;
                    readonly is_biddable: boolean | null;
                    readonly is_acquireable: boolean | null;
                    readonly is_offerable: boolean | null;
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
                    readonly __typename: "Artwork";
                }) | null;
                readonly cursor: string;
                readonly id: string | null;
            }) | null> | null;
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly id: string | null;
        }) | null;
        readonly pastSmallShows?: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly slug: string;
                    readonly href: string | null;
                    readonly is_fair_booth: boolean | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly kind: string | null;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly status_update: string | null;
                    readonly status: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly location: ({
                        readonly city: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly id: string | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly pastLargeShows?: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly is_fair_booth: boolean | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly kind: string | null;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly status_update: string | null;
                    readonly status: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly location: ({
                        readonly city: string | null;
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
    }) | null;
};
export type ArtistTestsQuery = {
    readonly response: ArtistTestsQueryResponse;
    readonly variables: ArtistTestsQueryVariables;
    readonly rawResponse: ArtistTestsQueryRawResponse;
};



/*
query ArtistTestsQuery(
  $isPad: Boolean!
) {
  artist(id: "andy-warhol") {
    ...Artist_artist
    id
  }
}

fragment Artist_artist on Artist {
  internalID
  slug
  has_metadata: hasMetadata
  counts {
    artworks
    partner_shows: partnerShows
    related_artists: relatedArtists
    articles
  }
  ...ArtistHeader_artist
  ...ArtistAbout_artist
  ...ArtistShows_artist
  ...ArtistArtworks_artist
}

fragment ArtistHeader_artist on Artist {
  id
  internalID
  slug
  isFollowed
  name
  nationality
  birthday
  counts {
    follows
  }
}

fragment ArtistAbout_artist on Artist {
  has_metadata: hasMetadata
  is_display_auction_link: isDisplayAuctionLink
  slug
  ...Biography_artist
  related {
    artists: artistsConnection(first: 16) {
      edges {
        node {
          ...RelatedArtists_artists
          id
        }
      }
    }
  }
  articles: articlesConnection(first: 10) {
    edges {
      node {
        ...Articles_articles
        id
      }
    }
  }
}

fragment ArtistShows_artist on Artist {
  currentShows: showsConnection(status: "running", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  upcomingShows: showsConnection(status: "upcoming", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  pastSmallShows: showsConnection(status: "closed", first: 20) @skip(if: $isPad) {
    edges {
      node {
        ...SmallList_shows
        id
      }
    }
  }
  pastLargeShows: showsConnection(status: "closed", first: 20) @include(if: $isPad) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
}

fragment ArtistArtworks_artist on Artist {
  id
  artworks: filterArtworksConnection(first: 10, sort: "-decayed_merch", aggregations: [TOTAL]) {
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
    id
  }
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

fragment VariableSizeShowsList_shows on Show {
  id
  ...ArtistShow_show
}

fragment SmallList_shows on Show {
  ...ArtistShow_show
}

fragment ArtistShow_show on Show {
  slug
  href
  is_fair_booth: isFairBooth
  cover_image: coverImage {
    url(version: "large")
  }
  ...Metadata_show
}

fragment Metadata_show on Show {
  kind
  name
  exhibition_period: exhibitionPeriod
  status_update: statusUpdate
  status
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      id
    }
  }
  location {
    city
    id
  }
}

fragment Biography_artist on Artist {
  bio
  blurb
}

fragment RelatedArtists_artists on Artist {
  id
  ...RelatedArtist_artist
}

fragment Articles_articles on Article {
  id
  ...Article_article
}

fragment Article_article on Article {
  thumbnail_title: thumbnailTitle
  href
  author {
    name
    id
  }
  thumbnail_image: thumbnailImage {
    url(version: "large")
  }
}

fragment RelatedArtist_artist on Artist {
  href
  name
  counts {
    forSaleArtworks
    artworks
  }
  image {
    url(version: "large")
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "isPad",
    "type": "Boolean!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "andy-warhol"
  }
],
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
  "name": "artworks",
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
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
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
v8 = [
  (v7/*: any*/)
],
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v10 = [
  (v5/*: any*/),
  (v4/*: any*/)
],
v11 = {
  "kind": "ScalarField",
  "alias": "is_fair_booth",
  "name": "isFairBooth",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "LinkedField",
  "alias": "cover_image",
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v8/*: any*/)
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "kind",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": "status_update",
  "name": "statusUpdate",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v18 = [
  (v5/*: any*/)
],
v19 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": null,
  "plural": false,
  "selections": [
    (v17/*: any*/),
    (v4/*: any*/),
    {
      "kind": "InlineFragment",
      "type": "Partner",
      "selections": (v18/*: any*/)
    },
    {
      "kind": "InlineFragment",
      "type": "ExternalPartner",
      "selections": (v18/*: any*/)
    }
  ]
},
v20 = {
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
      "name": "city",
      "args": null,
      "storageKey": null
    },
    (v4/*: any*/)
  ]
},
v21 = [
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
          (v2/*: any*/),
          (v6/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v5/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/)
        ]
      }
    ]
  }
],
v22 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "TOTAL"
    ]
  },
  (v9/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "-decayed_merch"
  }
],
v23 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "closed"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"andy-warhol\")",
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artist_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistTestsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"andy-warhol\")",
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "has_metadata",
            "name": "hasMetadata",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistCounts",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": "partner_shows",
                "name": "partnerShows",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "related_artists",
                "name": "relatedArtists",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "articles",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "follows",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isFollowed",
            "args": null,
            "storageKey": null
          },
          (v5/*: any*/),
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
            "alias": "is_display_auction_link",
            "name": "isDisplayAuctionLink",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "bio",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "blurb",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "related",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "artists",
                "name": "artistsConnection",
                "storageKey": "artistsConnection(first:16)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 16
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
                          (v4/*: any*/),
                          (v6/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "counts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "forSaleArtworks",
                                "args": null,
                                "storageKey": null
                              },
                              (v3/*: any*/)
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
                            "selections": (v8/*: any*/)
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
            "alias": "articles",
            "name": "articlesConnection",
            "storageKey": "articlesConnection(first:10)",
            "args": [
              (v9/*: any*/)
            ],
            "concreteType": "ArticleConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArticleEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Article",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": "thumbnail_title",
                        "name": "thumbnailTitle",
                        "args": null,
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Author",
                        "plural": false,
                        "selections": (v10/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "thumbnail_image",
                        "name": "thumbnailImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": (v8/*: any*/)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "currentShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"running\")",
            "args": [
              (v9/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v21/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "upcomingShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"upcoming\")",
            "args": [
              (v9/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v21/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(aggregations:[\"TOTAL\"],first:10,sort:\"-decayed_merch\")",
            "args": (v22/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
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
                      (v2/*: any*/),
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
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": "aspect_ratio",
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
                          (v4/*: any*/)
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
                          (v4/*: any*/)
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
                        "selections": (v10/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v10/*: any*/)
                      },
                      (v6/*: any*/),
                      (v17/*: any*/)
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ]
              },
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
              (v4/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "artworks",
            "name": "filterArtworksConnection",
            "args": (v22/*: any*/),
            "handle": "connection",
            "key": "ArtistArtworksGrid_artworks",
            "filters": [
              "sort",
              "aggregations"
            ]
          },
          {
            "kind": "Condition",
            "passingValue": false,
            "condition": "isPad",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "pastSmallShows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:20,status:\"closed\")",
                "args": (v23/*: any*/),
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
                          (v2/*: any*/),
                          (v6/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v5/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
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
            "kind": "Condition",
            "passingValue": true,
            "condition": "isPad",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "pastLargeShows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:20,status:\"closed\")",
                "args": (v23/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": (v21/*: any*/)
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistTestsQuery",
    "id": "7d7098d94a1abc48285b0aa2b68cbe58",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '845b9534ea8b9c3b6feb24cf11c76504';
export default node;
