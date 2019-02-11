/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artist_artist$ref } from "./Artist_artist.graphql";
export type QueryRenderersArtistQueryVariables = {
    readonly artistID: string;
    readonly isPad: boolean;
};
export type QueryRenderersArtistQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": Artist_artist$ref;
    }) | null;
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
    __id
  }
}

fragment Artist_artist on Artist {
  _id
  id
  has_metadata
  counts {
    artworks
    partner_shows
    related_artists
    articles
  }
  ...Header_artist
  ...About_artist
  ...Shows_artist
  ...Artworks_artist
  __id
}

fragment Header_artist on Artist {
  _id
  id
  name
  nationality
  birthday
  counts {
    follows
  }
  __id
}

fragment About_artist on Artist {
  has_metadata
  is_display_auction_link
  id
  ...Biography_artist
  related_artists: artists(size: 16) {
    ...RelatedArtists_artists
    __id
  }
  articles {
    ...Articles_articles
    __id
  }
  __id
}

fragment Shows_artist on Artist {
  current_shows: partner_shows(status: "running") {
    ...VariableSizeShowsList_shows
    __id
  }
  upcoming_shows: partner_shows(status: "upcoming") {
    ...VariableSizeShowsList_shows
    __id
  }
  past_small_shows: partner_shows(status: "closed", size: 20) @skip(if: $isPad) {
    ...SmallList_shows
    __id
  }
  past_large_shows: partner_shows(status: "closed", size: 20) @include(if: $isPad) {
    ...VariableSizeShowsList_shows
    __id
  }
  __id
}

fragment Artworks_artist on Artist {
  counts {
    artworks
    for_sale_artworks
  }
  ...ArtistForSaleArtworksGrid_artist
  ...ArtistNotForSaleArtworksGrid_artist
  __id
}

fragment ArtistForSaleArtworksGrid_artist on Artist {
  __id
  forSaleArtworks: artworks_connection(first: 10, filter: [IS_FOR_SALE], sort: partner_updated_at_desc) {
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

fragment ArtistNotForSaleArtworksGrid_artist on Artist {
  __id
  notForSaleArtworks: artworks_connection(first: 10, filter: [IS_NOT_FOR_SALE], sort: partner_updated_at_desc) {
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

fragment VariableSizeShowsList_shows on PartnerShow {
  __id
  ...ArtistShow_show
}

fragment SmallList_shows on PartnerShow {
  ...ArtistShow_show
  __id
}

fragment ArtistShow_show on PartnerShow {
  href
  cover_image {
    url(version: "large")
  }
  ...Metadata_show
  __id
}

fragment Metadata_show on PartnerShow {
  kind
  name
  exhibition_period
  status_update
  status
  partner {
    name
    __id
  }
  location {
    city
    __id
  }
  __id
}

fragment Biography_artist on Artist {
  bio
  blurb
  __id
}

fragment RelatedArtists_artists on Artist {
  __id
  ...RelatedArtist_artist
}

fragment Articles_articles on Article {
  __id
  ...Article_article
}

fragment Article_article on Article {
  thumbnail_title
  href
  author {
    name
    __id
  }
  thumbnail_image {
    url(version: "large")
  }
  __id
}

fragment RelatedArtist_artist on Artist {
  href
  name
  counts {
    for_sale_artworks
    artworks
  }
  image {
    url(version: "large")
  }
  __id
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
    "variableName": "artistID",
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artworks",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "for_sale_artworks",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
      "value": "large",
      "type": "[String]"
    }
  ],
  "storageKey": "url(version:\"large\")"
},
v9 = [
  v8
],
v10 = [
  v6,
  v2
],
v11 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": v9
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "kind",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status_update",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v10
},
v17 = {
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
    v2
  ]
},
v18 = [
  v2,
  v7,
  v11,
  v12,
  v6,
  v13,
  v14,
  v15,
  v16,
  v17
],
v19 = {
  "kind": "Literal",
  "name": "first",
  "value": 10,
  "type": "Int"
},
v20 = {
  "kind": "Literal",
  "name": "sort",
  "value": "partner_updated_at_desc",
  "type": "ArtworkSorts"
},
v21 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v22 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v23 = [
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
          v3,
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspect_ratio",
                "args": null,
                "storageKey": null
              },
              v8
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
              v21,
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
                "selections": v22
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "current_bid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "plural": false,
                "selections": v22
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
                  v21,
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
            "selections": v10
          },
          v16,
          v7,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          }
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
v24 = [
  "filter",
  "sort"
],
v25 = [
  {
    "kind": "Literal",
    "name": "size",
    "value": 20,
    "type": "Int"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "closed",
    "type": "String"
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersArtistQuery",
  "id": "2c6d2302caee4356da07cad0fed5554f",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersArtistQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artist_artist",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersArtistQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
          v3,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "has_metadata",
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
              v4,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "partner_shows",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "related_artists",
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
              v5
            ]
          },
          v6,
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
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_display_auction_link",
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
                "value": 16,
                "type": "Int"
              }
            ],
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              v2,
              v7,
              v6,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "counts",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistCounts",
                "plural": false,
                "selections": [
                  v5,
                  v4
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
                "selections": v9
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "articles",
            "storageKey": null,
            "args": null,
            "concreteType": "Article",
            "plural": true,
            "selections": [
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "thumbnail_title",
                "args": null,
                "storageKey": null
              },
              v7,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "author",
                "storageKey": null,
                "args": null,
                "concreteType": "Author",
                "plural": false,
                "selections": v10
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "thumbnail_image",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": v9
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "current_shows",
            "name": "partner_shows",
            "storageKey": "partner_shows(status:\"running\")",
            "args": [
              {
                "kind": "Literal",
                "name": "status",
                "value": "running",
                "type": "String"
              }
            ],
            "concreteType": "PartnerShow",
            "plural": true,
            "selections": v18
          },
          {
            "kind": "LinkedField",
            "alias": "upcoming_shows",
            "name": "partner_shows",
            "storageKey": "partner_shows(status:\"upcoming\")",
            "args": [
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming",
                "type": "String"
              }
            ],
            "concreteType": "PartnerShow",
            "plural": true,
            "selections": v18
          },
          {
            "kind": "LinkedField",
            "alias": "forSaleArtworks",
            "name": "artworks_connection",
            "storageKey": "artworks_connection(filter:[\"IS_FOR_SALE\"],first:10,sort:\"partner_updated_at_desc\")",
            "args": [
              {
                "kind": "Literal",
                "name": "filter",
                "value": [
                  "IS_FOR_SALE"
                ],
                "type": "[ArtistArtworksFilters]"
              },
              v19,
              v20
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": v23
          },
          {
            "kind": "LinkedHandle",
            "alias": "forSaleArtworks",
            "name": "artworks_connection",
            "args": [
              {
                "kind": "Literal",
                "name": "filter",
                "value": [
                  "IS_FOR_SALE"
                ],
                "type": "[ArtistArtworksFilters]"
              },
              v19,
              v20
            ],
            "handle": "connection",
            "key": "ArtistForSaleArtworksGrid_forSaleArtworks",
            "filters": v24
          },
          {
            "kind": "LinkedField",
            "alias": "notForSaleArtworks",
            "name": "artworks_connection",
            "storageKey": "artworks_connection(filter:[\"IS_NOT_FOR_SALE\"],first:10,sort:\"partner_updated_at_desc\")",
            "args": [
              {
                "kind": "Literal",
                "name": "filter",
                "value": [
                  "IS_NOT_FOR_SALE"
                ],
                "type": "[ArtistArtworksFilters]"
              },
              v19,
              v20
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": v23
          },
          {
            "kind": "LinkedHandle",
            "alias": "notForSaleArtworks",
            "name": "artworks_connection",
            "args": [
              {
                "kind": "Literal",
                "name": "filter",
                "value": [
                  "IS_NOT_FOR_SALE"
                ],
                "type": "[ArtistArtworksFilters]"
              },
              v19,
              v20
            ],
            "handle": "connection",
            "key": "ArtistNotForSaleArtworksGrid_notForSaleArtworks",
            "filters": v24
          },
          {
            "kind": "Condition",
            "passingValue": false,
            "condition": "isPad",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "past_small_shows",
                "name": "partner_shows",
                "storageKey": "partner_shows(size:20,status:\"closed\")",
                "args": v25,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": [
                  v7,
                  v11,
                  v12,
                  v6,
                  v13,
                  v14,
                  v15,
                  v16,
                  v17,
                  v2
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
                "alias": "past_large_shows",
                "name": "partner_shows",
                "storageKey": "partner_shows(size:20,status:\"closed\")",
                "args": v25,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": v18
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '4f96ab0eb841e4e302758c475a4c3561';
export default node;
