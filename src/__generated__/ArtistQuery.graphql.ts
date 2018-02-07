/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ArtistQueryVariables = {
    readonly artistID: string;
};
export type ArtistQueryResponse = {
    readonly artist: ({
    }) | null;
};



/*
query ArtistQuery(
  $artistID: String!
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
  id
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_open
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
  ...Show_show
}

fragment SmallList_shows on PartnerShow {
  ...Show_show
  __id
}

fragment Show_show on PartnerShow {
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
  "name": "artworks",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "for_sale_artworks",
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
  v5,
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
  "selections": v10,
  "idField": "__id"
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
  ],
  "idField": "__id"
},
v18 = [
  v2,
  v7,
  v11,
  v12,
  v5,
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
v21 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v22 = [
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_in_auction",
            "args": null,
            "storageKey": null
          },
          v6,
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
          v2,
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
                "selections": v21
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "current_bid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "plural": false,
                "selections": v21
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "is_open",
                    "args": null,
                    "storageKey": null
                  },
                  v2
                ],
                "idField": "__id"
              },
              v2
            ],
            "idField": "__id"
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
            "selections": v10,
            "idField": "__id"
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
        ],
        "idField": "__id"
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
v23 = [
  "filter",
  "sort"
],
v24 = [
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
  "name": "ArtistQuery",
  "id": null,
  "text": "query ArtistQuery(\n  $artistID: String!\n) {\n  artist(id: $artistID) {\n    ...Artist_artist\n    __id\n  }\n}\n\nfragment Artist_artist on Artist {\n  _id\n  id\n  has_metadata\n  counts {\n    artworks\n    partner_shows\n    related_artists\n    articles\n  }\n  ...Header_artist\n  ...About_artist\n  ...Shows_artist\n  ...Artworks_artist\n  __id\n}\n\nfragment Header_artist on Artist {\n  _id\n  id\n  name\n  nationality\n  birthday\n  counts {\n    follows\n  }\n  __id\n}\n\nfragment About_artist on Artist {\n  has_metadata\n  is_display_auction_link\n  id\n  ...Biography_artist\n  related_artists: artists(size: 16) {\n    ...RelatedArtists_artists\n    __id\n  }\n  articles {\n    ...Articles_articles\n    __id\n  }\n  __id\n}\n\nfragment Shows_artist on Artist {\n  current_shows: partner_shows(status: \"running\") {\n    ...VariableSizeShowsList_shows\n    __id\n  }\n  upcoming_shows: partner_shows(status: \"upcoming\") {\n    ...VariableSizeShowsList_shows\n    __id\n  }\n  past_small_shows: partner_shows(status: \"closed\", size: 20) @skip(if: $isPad) {\n    ...SmallList_shows\n    __id\n  }\n  past_large_shows: partner_shows(status: \"closed\", size: 20) @include(if: $isPad) {\n    ...VariableSizeShowsList_shows\n    __id\n  }\n  __id\n}\n\nfragment Artworks_artist on Artist {\n  counts {\n    artworks\n    for_sale_artworks\n  }\n  ...ArtistForSaleArtworksGrid_artist\n  ...ArtistNotForSaleArtworksGrid_artist\n  __id\n}\n\nfragment ArtistForSaleArtworksGrid_artist on Artist {\n  __id\n  forSaleArtworks: artworks_connection(first: 10, filter: [IS_FOR_SALE], sort: partner_updated_at_desc) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        id\n        __id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __typename\n      }\n      cursor\n    }\n  }\n}\n\nfragment ArtistNotForSaleArtworksGrid_artist on Artist {\n  __id\n  notForSaleArtworks: artworks_connection(first: 10, filter: [IS_NOT_FOR_SALE], sort: partner_updated_at_desc) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        id\n        __id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __typename\n      }\n      cursor\n    }\n  }\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  id\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_open\n      __id\n    }\n    __id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id\n  }\n  partner {\n    name\n    __id\n  }\n  href\n  __id\n}\n\nfragment VariableSizeShowsList_shows on PartnerShow {\n  __id\n  ...Show_show\n}\n\nfragment SmallList_shows on PartnerShow {\n  ...Show_show\n  __id\n}\n\nfragment Show_show on PartnerShow {\n  href\n  cover_image {\n    url(version: \"large\")\n  }\n  ...Metadata_show\n  __id\n}\n\nfragment Metadata_show on PartnerShow {\n  kind\n  name\n  exhibition_period\n  status_update\n  status\n  partner {\n    name\n    __id\n  }\n  location {\n    city\n    __id\n  }\n  __id\n}\n\nfragment Biography_artist on Artist {\n  bio\n  blurb\n  __id\n}\n\nfragment RelatedArtists_artists on Artist {\n  __id\n  ...RelatedArtist_artist\n}\n\nfragment Articles_articles on Article {\n  __id\n  ...Article_article\n}\n\nfragment Article_article on Article {\n  thumbnail_title\n  href\n  author {\n    name\n    __id\n  }\n  thumbnail_image {\n    url(version: \"large\")\n  }\n  __id\n}\n\nfragment RelatedArtist_artist on Artist {\n  href\n  name\n  counts {\n    for_sale_artworks\n    artworks\n  }\n  image {\n    url(version: \"large\")\n  }\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistQuery",
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
        ],
        "idField": "__id"
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistQuery",
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
            "name": "bio",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
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
              v3,
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
              v4
            ]
          },
          v5,
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
          v6,
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
              v5,
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
                  v3
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
            ],
            "idField": "__id"
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
                "selections": v10,
                "idField": "__id"
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
            ],
            "idField": "__id"
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
            "selections": v18,
            "idField": "__id"
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
            "selections": v18,
            "idField": "__id"
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
            "selections": v22
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
            "filters": v23
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
            "selections": v22
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
            "filters": v23
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
                "args": v24,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": [
                  v7,
                  v11,
                  v12,
                  v5,
                  v13,
                  v14,
                  v15,
                  v16,
                  v17,
                  v2
                ],
                "idField": "__id"
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
                "args": v24,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": v18,
                "idField": "__id"
              }
            ]
          }
        ],
        "idField": "__id"
      }
    ]
  }
};
})();
(node as any).hash = '2b80a160abbe2890ba5c998d639c23c3';
export default node;
