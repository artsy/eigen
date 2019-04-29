/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artist_artist$ref } from "./Artist_artist.graphql";
export type ArtistQueryVariables = {
    readonly artistID: string;
    readonly isPad: boolean;
};
export type ArtistQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": Artist_artist$ref;
    }) | null;
};
export type ArtistQuery = {
    readonly response: ArtistQueryResponse;
    readonly variables: ArtistQueryVariables;
};



/*
query ArtistQuery(
  $artistID: String!
  $isPad: Boolean!
) {
  artist(id: $artistID) {
    ...Artist_artist
    __id: id
  }
}

fragment Artist_artist on Artist {
  internalID
  gravityID
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
  __id: id
}

fragment Header_artist on Artist {
  internalID
  gravityID
  name
  nationality
  birthday
  counts {
    follows
  }
  __id: id
}

fragment About_artist on Artist {
  has_metadata
  is_display_auction_link
  gravityID
  ...Biography_artist
  related_artists: artists(size: 16) {
    ...RelatedArtists_artists
    __id: id
  }
  articles {
    ...Articles_articles
    __id: id
  }
  __id: id
}

fragment Shows_artist on Artist {
  current_shows: partner_shows(status: "running") {
    ...VariableSizeShowsList_shows
    __id: id
  }
  upcoming_shows: partner_shows(status: "upcoming") {
    ...VariableSizeShowsList_shows
    __id: id
  }
  past_small_shows: partner_shows(status: "closed", size: 20) @skip(if: $isPad) {
    ...SmallList_shows
    __id: id
  }
  past_large_shows: partner_shows(status: "closed", size: 20) @include(if: $isPad) {
    ...VariableSizeShowsList_shows
    __id: id
  }
  __id: id
}

fragment Artworks_artist on Artist {
  counts {
    artworks
    for_sale_artworks
  }
  ...ArtistForSaleArtworksGrid_artist
  ...ArtistNotForSaleArtworksGrid_artist
  __id: id
}

fragment ArtistForSaleArtworksGrid_artist on Artist {
  id
  forSaleArtworks: artworks_connection(first: 10, filter: [IS_FOR_SALE], sort: partner_updated_at_desc) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        gravityID
        id
        image {
          aspect_ratio
        }
        ...Artwork_artwork
        __id: id
        __typename
      }
      cursor
    }
  }
  __id: id
}

fragment ArtistNotForSaleArtworksGrid_artist on Artist {
  id
  notForSaleArtworks: artworks_connection(first: 10, filter: [IS_NOT_FOR_SALE], sort: partner_updated_at_desc) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        gravityID
        id
        image {
          aspect_ratio
        }
        ...Artwork_artwork
        __id: id
        __typename
      }
      cursor
    }
  }
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

fragment VariableSizeShowsList_shows on PartnerShow {
  id
  ...ArtistShow_show
  __id: id
}

fragment SmallList_shows on PartnerShow {
  ...ArtistShow_show
  __id: id
}

fragment ArtistShow_show on PartnerShow {
  gravityID
  href
  is_fair_booth
  cover_image {
    url(version: "large")
  }
  ...Metadata_show
  __id: id
}

fragment Metadata_show on PartnerShow {
  kind
  name
  exhibition_period
  status_update
  status
  partner {
    name
    __id: id
  }
  location {
    city
    __id: id
  }
  __id: id
}

fragment Biography_artist on Artist {
  bio
  blurb
  __id: id
}

fragment RelatedArtists_artists on Artist {
  id
  ...RelatedArtist_artist
  __id: id
}

fragment Articles_articles on Article {
  id
  ...Article_article
  __id: id
}

fragment Article_article on Article {
  thumbnail_title
  href
  author {
    name
    __id: id
  }
  thumbnail_image {
    url(version: "large")
  }
  __id: id
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
  __id: id
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
  "alias": "__id",
  "name": "id",
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
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v9 = {
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
v10 = [
  v9
],
v11 = [
  v5,
  v2
],
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_fair_booth",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": v10
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
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status_update",
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
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v11
},
v19 = {
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
v20 = [
  v5,
  v7,
  v8,
  v12,
  v13,
  v14,
  v6,
  v15,
  v16,
  v17,
  v18,
  v19,
  v2
],
v21 = {
  "kind": "Literal",
  "name": "first",
  "value": 10,
  "type": "Int"
},
v22 = {
  "kind": "Literal",
  "name": "sort",
  "value": "partner_updated_at_desc",
  "type": "ArtworkSorts"
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v24 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_acquireable",
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
              v9
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
              v23,
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
                "selections": v24
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "current_bid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "plural": false,
                "selections": v24
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
                  v23,
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
            "selections": v11
          },
          v18,
          v8,
          v2,
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
v26 = [
  "filter",
  "sort"
],
v27 = [
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
  "text": "query ArtistQuery(\n  $artistID: String!\n  $isPad: Boolean!\n) {\n  artist(id: $artistID) {\n    ...Artist_artist\n    __id: id\n  }\n}\n\nfragment Artist_artist on Artist {\n  internalID\n  gravityID\n  has_metadata\n  counts {\n    artworks\n    partner_shows\n    related_artists\n    articles\n  }\n  ...Header_artist\n  ...About_artist\n  ...Shows_artist\n  ...Artworks_artist\n  __id: id\n}\n\nfragment Header_artist on Artist {\n  internalID\n  gravityID\n  name\n  nationality\n  birthday\n  counts {\n    follows\n  }\n  __id: id\n}\n\nfragment About_artist on Artist {\n  has_metadata\n  is_display_auction_link\n  gravityID\n  ...Biography_artist\n  related_artists: artists(size: 16) {\n    ...RelatedArtists_artists\n    __id: id\n  }\n  articles {\n    ...Articles_articles\n    __id: id\n  }\n  __id: id\n}\n\nfragment Shows_artist on Artist {\n  current_shows: partner_shows(status: \"running\") {\n    ...VariableSizeShowsList_shows\n    __id: id\n  }\n  upcoming_shows: partner_shows(status: \"upcoming\") {\n    ...VariableSizeShowsList_shows\n    __id: id\n  }\n  past_small_shows: partner_shows(status: \"closed\", size: 20) @skip(if: $isPad) {\n    ...SmallList_shows\n    __id: id\n  }\n  past_large_shows: partner_shows(status: \"closed\", size: 20) @include(if: $isPad) {\n    ...VariableSizeShowsList_shows\n    __id: id\n  }\n  __id: id\n}\n\nfragment Artworks_artist on Artist {\n  counts {\n    artworks\n    for_sale_artworks\n  }\n  ...ArtistForSaleArtworksGrid_artist\n  ...ArtistNotForSaleArtworksGrid_artist\n  __id: id\n}\n\nfragment ArtistForSaleArtworksGrid_artist on Artist {\n  id\n  forSaleArtworks: artworks_connection(first: 10, filter: [IS_FOR_SALE], sort: partner_updated_at_desc) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        gravityID\n        id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n\nfragment ArtistNotForSaleArtworksGrid_artist on Artist {\n  id\n  notForSaleArtworks: artworks_connection(first: 10, filter: [IS_NOT_FOR_SALE], sort: partner_updated_at_desc) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        gravityID\n        id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n\nfragment VariableSizeShowsList_shows on PartnerShow {\n  id\n  ...ArtistShow_show\n  __id: id\n}\n\nfragment SmallList_shows on PartnerShow {\n  ...ArtistShow_show\n  __id: id\n}\n\nfragment ArtistShow_show on PartnerShow {\n  gravityID\n  href\n  is_fair_booth\n  cover_image {\n    url(version: \"large\")\n  }\n  ...Metadata_show\n  __id: id\n}\n\nfragment Metadata_show on PartnerShow {\n  kind\n  name\n  exhibition_period\n  status_update\n  status\n  partner {\n    name\n    __id: id\n  }\n  location {\n    city\n    __id: id\n  }\n  __id: id\n}\n\nfragment Biography_artist on Artist {\n  bio\n  blurb\n  __id: id\n}\n\nfragment RelatedArtists_artists on Artist {\n  id\n  ...RelatedArtist_artist\n  __id: id\n}\n\nfragment Articles_articles on Article {\n  id\n  ...Article_article\n  __id: id\n}\n\nfragment Article_article on Article {\n  thumbnail_title\n  href\n  author {\n    name\n    __id: id\n  }\n  thumbnail_image {\n    url(version: \"large\")\n  }\n  __id: id\n}\n\nfragment RelatedArtist_artist on Artist {\n  href\n  name\n  counts {\n    for_sale_artworks\n    artworks\n  }\n  image {\n    url(version: \"large\")\n  }\n  __id: id\n}\n",
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
        ]
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
            "name": "blurb",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "bio",
            "args": null,
            "storageKey": null
          },
          v6,
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
              v7,
              v8,
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
                "selections": v10
              },
              v2
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
              v7,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "thumbnail_title",
                "args": null,
                "storageKey": null
              },
              v8,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "author",
                "storageKey": null,
                "args": null,
                "concreteType": "Author",
                "plural": false,
                "selections": v11
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "thumbnail_image",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": v10
              },
              v2
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
            "selections": v20
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
            "selections": v20
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
              v21,
              v22
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": v25
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
              v21,
              v22
            ],
            "handle": "connection",
            "key": "ArtistForSaleArtworksGrid_forSaleArtworks",
            "filters": v26
          },
          v7,
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
              v21,
              v22
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": v25
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
              v21,
              v22
            ],
            "handle": "connection",
            "key": "ArtistNotForSaleArtworksGrid_notForSaleArtworks",
            "filters": v26
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
                "args": v27,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": [
                  v15,
                  v6,
                  v12,
                  v13,
                  v14,
                  v5,
                  v8,
                  v16,
                  v17,
                  v18,
                  v19,
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
                "args": v27,
                "concreteType": "PartnerShow",
                "plural": true,
                "selections": v20
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6a902270192e72b16e83984c84c75279';
export default node;
