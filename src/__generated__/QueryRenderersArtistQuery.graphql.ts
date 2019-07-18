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
  has_metadata
  is_display_auction_link
  slug
  ...Biography_artist
  related_artists: artists(size: 16) {
    ...RelatedArtists_artists
    id
  }
  articles {
    ...Articles_articles
    id
  }
}

fragment Shows_artist on Artist {
  current_shows: shows(status: "running") {
    ...VariableSizeShowsList_shows
    id
  }
  upcoming_shows: shows(status: "upcoming") {
    ...VariableSizeShowsList_shows
    id
  }
  past_small_shows: shows(status: "closed", size: 20) @skip(if: $isPad) {
    ...SmallList_shows
    id
  }
  past_large_shows: shows(status: "closed", size: 20) @include(if: $isPad) {
    ...VariableSizeShowsList_shows
    id
  }
}

fragment Artworks_artist on Artist {
  counts {
    artworks
    for_sale_artworks
  }
  ...ArtistForSaleArtworksGrid_artist
  ...ArtistNotForSaleArtworksGrid_artist
}

fragment ArtistForSaleArtworksGrid_artist on Artist {
  id
  forSaleArtworks: artworks_connection(first: 10, filter: [IS_FOR_SALE], sort: PARTNER_UPDATED_AT_DESC) {
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
          aspect_ratio
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
  notForSaleArtworks: artworks_connection(first: 10, filter: [IS_NOT_FOR_SALE], sort: PARTNER_UPDATED_AT_DESC) {
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
          aspect_ratio
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
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  slug
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    id
  }
  sale_artwork {
    current_bid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio
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
  is_fair_booth
  cover_image {
    url(version: "large")
  }
  ...Metadata_show
}

fragment Metadata_show on Show {
  kind
  name
  exhibition_period
  status_update
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
  thumbnail_title
  href
  author {
    name
    id
  }
  thumbnail_image {
    url(version: "large")
  }
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
      "value": "large"
    }
  ],
  "storageKey": "url(version:\"large\")"
},
v9 = [
  (v8/*: any*/)
],
v10 = [
  (v5/*: any*/),
  (v6/*: any*/)
],
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_fair_booth",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v9/*: any*/)
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
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status_update",
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
    (v6/*: any*/),
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
    (v6/*: any*/)
  ]
},
v21 = [
  (v6/*: any*/),
  (v2/*: any*/),
  (v7/*: any*/),
  (v11/*: any*/),
  (v12/*: any*/),
  (v13/*: any*/),
  (v5/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/),
  (v19/*: any*/),
  (v20/*: any*/)
],
v22 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
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
  (v22/*: any*/),
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
                "alias": null,
                "name": "aspect_ratio",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_closed",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "display_timely_at",
                "args": null,
                "storageKey": null
              },
              (v6/*: any*/)
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
                "name": "current_bid",
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
          (v7/*: any*/),
          (v17/*: any*/)
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
  (v22/*: any*/),
  (v23/*: any*/)
],
v28 = [
  {
    "kind": "Literal",
    "name": "size",
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
              (v3/*: any*/),
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
            "storageKey": null,
            "args": null,
            "concreteType": "Article",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "thumbnail_title",
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
                "selections": (v10/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "thumbnail_image",
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
            "alias": "current_shows",
            "name": "shows",
            "storageKey": "shows(status:\"running\")",
            "args": [
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "Show",
            "plural": true,
            "selections": (v21/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "upcoming_shows",
            "name": "shows",
            "storageKey": "shows(status:\"upcoming\")",
            "args": [
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "Show",
            "plural": true,
            "selections": (v21/*: any*/)
          },
          (v6/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "forSaleArtworks",
            "name": "artworks_connection",
            "storageKey": "artworks_connection(filter:[\"IS_FOR_SALE\"],first:10,sort:\"PARTNER_UPDATED_AT_DESC\")",
            "args": (v24/*: any*/),
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": (v25/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": "forSaleArtworks",
            "name": "artworks_connection",
            "args": (v24/*: any*/),
            "handle": "connection",
            "key": "ArtistForSaleArtworksGrid_forSaleArtworks",
            "filters": (v26/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "notForSaleArtworks",
            "name": "artworks_connection",
            "storageKey": "artworks_connection(filter:[\"IS_NOT_FOR_SALE\"],first:10,sort:\"PARTNER_UPDATED_AT_DESC\")",
            "args": (v27/*: any*/),
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": (v25/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": "notForSaleArtworks",
            "name": "artworks_connection",
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
                "alias": "past_small_shows",
                "name": "shows",
                "storageKey": "shows(size:20,status:\"closed\")",
                "args": (v28/*: any*/),
                "concreteType": "Show",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v7/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v5/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v6/*: any*/)
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
                "name": "shows",
                "storageKey": "shows(size:20,status:\"closed\")",
                "args": (v28/*: any*/),
                "concreteType": "Show",
                "plural": true,
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
    "name": "QueryRenderersArtistQuery",
    "id": "d747fe0089dc31df1ca24e5f94b56b6a",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4f96ab0eb841e4e302758c475a4c3561';
export default node;
