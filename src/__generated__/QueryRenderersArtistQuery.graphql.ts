/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artist_artist$ref } from "./Artist_artist.graphql";
export type QueryRenderersArtistQueryVariables = {
    readonly artistID: string;
    readonly isPad: boolean;
};
export type QueryRenderersArtistQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": Artist_artist$ref;
    } | null;
};
export type QueryRenderersArtistQuery = {
    readonly response: QueryRenderersArtistQueryResponse;
    readonly variables: QueryRenderersArtistQueryVariables;
};



/*
query QueryRenderersArtistQuery(
  $artistID: String!
  $isPad: Boolean!
) {
  artist(id: $artistID) {
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
  ...Header_artist
  ...About_artist
  ...Shows_artist
  ...Artworks_artist
}

fragment Header_artist on Artist {
  internalID
  slug
  name
  nationality
  birthday
  counts {
    follows
  }
}

fragment About_artist on Artist {
  has_metadata: hasMetadata
  is_display_auction_link: isDisplayAuctionLink
  slug
  ...Biography_artist
  related_artists: artists(size: 16) {
    ...RelatedArtists_artists
    id
  }
  articles(first: 10) {
    edges {
      node {
        ...Articles_articles
        id
      }
    }
  }
}

fragment Shows_artist on Artist {
  currentShows: shows(status: "running", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  upcomingShows: shows(status: "upcoming", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  pastSmallShows: shows(status: "closed", first: 20) @skip(if: $isPad) {
    edges {
      node {
        ...SmallList_shows
        id
      }
    }
  }
  pastLargeShows: shows(status: "closed", first: 20) @include(if: $isPad) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
}

fragment Artworks_artist on Artist {
  counts {
    artworks
    for_sale_artworks: forSaleArtworks
  }
  ...ArtistForSaleArtworksGrid_artist
  ...ArtistNotForSaleArtworksGrid_artist
}

fragment ArtistForSaleArtworksGrid_artist on Artist {
  id
  forSaleArtworks: artworks(first: 10, filter: [IS_FOR_SALE], sort: PARTNER_UPDATED_AT_DESC) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        slug
        id
        image {
          aspect_ratio: aspectRatio
        }
        ...ArtworkGridItem_artwork
        __typename
      }
      cursor
    }
  }
}

fragment ArtistNotForSaleArtworksGrid_artist on Artist {
  id
  notForSaleArtworks: artworks(first: 10, filter: [IS_NOT_FOR_SALE], sort: PARTNER_UPDATED_AT_DESC) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        slug
        id
        image {
          aspect_ratio: aspectRatio
        }
        ...ArtworkGridItem_artwork
        __typename
      }
      cursor
    }
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_in_auction: isInAuction
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_live_open: isLiveOpen
    is_open: isOpen
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
    for_sale_artworks: forSaleArtworks
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
    "name": "artistID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "isPad",
    "type": "Boolean!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
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
  "alias": "for_sale_artworks",
  "name": "forSaleArtworks",
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
  "name": "id",
  "args": null,
  "storageKey": null
},
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
v9 = [
  (v8/*: any*/)
],
v10 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v11 = [
  (v5/*: any*/),
  (v6/*: any*/)
],
v12 = {
  "kind": "ScalarField",
  "alias": "is_fair_booth",
  "name": "isFairBooth",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "LinkedField",
  "alias": "cover_image",
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v9/*: any*/)
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "kind",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": "status_update",
  "name": "statusUpdate",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v19 = [
  (v5/*: any*/)
],
v20 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": null,
  "plural": false,
  "selections": [
    (v18/*: any*/),
    (v6/*: any*/),
    {
      "kind": "InlineFragment",
      "type": "Partner",
      "selections": (v19/*: any*/)
    },
    {
      "kind": "InlineFragment",
      "type": "ExternalPartner",
      "selections": (v19/*: any*/)
    }
  ]
},
v21 = {
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
    (v6/*: any*/)
  ]
},
v22 = [
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
          (v6/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v5/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/)
        ]
      }
    ]
  }
],
v23 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PARTNER_UPDATED_AT_DESC"
},
v24 = [
  {
    "kind": "Literal",
    "name": "filter",
    "value": [
      "IS_FOR_SALE"
    ]
  },
  (v10/*: any*/),
  (v23/*: any*/)
],
v25 = [
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
          (v2/*: any*/),
          (v6/*: any*/),
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
              (v8/*: any*/)
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
            "alias": "is_in_auction",
            "name": "isInAuction",
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
                "alias": "is_live_open",
                "name": "isLiveOpen",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "is_open",
                "name": "isOpen",
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
              (v6/*: any*/)
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
              (v6/*: any*/)
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
            "selections": (v11/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": (v11/*: any*/)
          },
          (v7/*: any*/),
          (v18/*: any*/)
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
],
v26 = [
  "filter",
  "sort"
],
v27 = [
  {
    "kind": "Literal",
    "name": "filter",
    "value": [
      "IS_NOT_FOR_SALE"
    ]
  },
  (v10/*: any*/),
  (v23/*: any*/)
],
v28 = [
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
    "name": "QueryRenderersArtistQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
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
    "name": "QueryRenderersArtistQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
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
              },
              (v4/*: any*/)
            ]
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
            "alias": "related_artists",
            "name": "artists",
            "storageKey": "artists(size:16)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 16
              }
            ],
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
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
                  (v4/*: any*/),
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
                "selections": (v9/*: any*/)
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "articles",
            "storageKey": "articles(first:10)",
            "args": [
              (v10/*: any*/)
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
                      (v6/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": "thumbnail_title",
                        "name": "thumbnailTitle",
                        "args": null,
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Author",
                        "plural": false,
                        "selections": (v11/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "thumbnail_image",
                        "name": "thumbnailImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": (v9/*: any*/)
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
            "name": "shows",
            "storageKey": "shows(first:10,status:\"running\")",
            "args": [
              (v10/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v22/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "upcomingShows",
            "name": "shows",
            "storageKey": "shows(first:10,status:\"upcoming\")",
            "args": [
              (v10/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v22/*: any*/)
          },
          (v6/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "forSaleArtworks",
            "name": "artworks",
            "storageKey": "artworks(filter:[\"IS_FOR_SALE\"],first:10,sort:\"PARTNER_UPDATED_AT_DESC\")",
            "args": (v24/*: any*/),
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": (v25/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": "forSaleArtworks",
            "name": "artworks",
            "args": (v24/*: any*/),
            "handle": "connection",
            "key": "ArtistForSaleArtworksGrid_forSaleArtworks",
            "filters": (v26/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "notForSaleArtworks",
            "name": "artworks",
            "storageKey": "artworks(filter:[\"IS_NOT_FOR_SALE\"],first:10,sort:\"PARTNER_UPDATED_AT_DESC\")",
            "args": (v27/*: any*/),
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": (v25/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": "notForSaleArtworks",
            "name": "artworks",
            "args": (v27/*: any*/),
            "handle": "connection",
            "key": "ArtistNotForSaleArtworksGrid_notForSaleArtworks",
            "filters": (v26/*: any*/)
          },
          {
            "kind": "Condition",
            "passingValue": false,
            "condition": "isPad",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "pastSmallShows",
                "name": "shows",
                "storageKey": "shows(first:20,status:\"closed\")",
                "args": (v28/*: any*/),
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
                          (v7/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v5/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v6/*: any*/)
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
                "name": "shows",
                "storageKey": "shows(first:20,status:\"closed\")",
                "args": (v28/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": (v22/*: any*/)
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersArtistQuery",
    "id": "91ff4c7bfb12cbd4087f4e864e5871d0",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4f96ab0eb841e4e302758c475a4c3561';
export default node;
