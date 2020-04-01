/* tslint:disable */
/* eslint-disable */
/* @relayHash d78d87b7c53a3699d755446b598fdb08 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistBelowTheFoldQueryVariables = {
    artistID: string;
    isPad: boolean;
};
export type ArtistBelowTheFoldQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistAbout_artist" | "ArtistShows_artist">;
    } | null;
};
export type ArtistBelowTheFoldQuery = {
    readonly response: ArtistBelowTheFoldQueryResponse;
    readonly variables: ArtistBelowTheFoldQueryVariables;
};



/*
query ArtistBelowTheFoldQuery(
  $artistID: String!
  $isPad: Boolean!
) {
  artist(id: $artistID) {
    ...ArtistAbout_artist
    ...ArtistShows_artist
    id
  }
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

fragment Articles_articles on Article {
  id
  ...Article_article
}

fragment ArtistAbout_artist on Artist {
  has_metadata: hasMetadata
  is_display_auction_link: isDisplayAuctionLink
  slug
  ...Biography_artist
  ...ArtistConsignButton_artist
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

fragment ArtistConsignButton_artist on Artist {
  targetSupply {
    isInMicrofunnel
  }
  internalID
  slug
  name
  image {
    cropped(width: 66, height: 66) {
      url
    }
  }
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

fragment Biography_artist on Artist {
  bio
  blurb
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

fragment RelatedArtists_artists on Artist {
  id
  ...RelatedArtist_artist
}

fragment SmallList_shows on Show {
  id
  ...ArtistShow_show
}

fragment VariableSizeShowsList_shows on Show {
  id
  ...ArtistShow_show
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
  "name": "name",
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
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = [
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
],
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v8 = [
  (v3/*: any*/)
],
v9 = [
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
          (v5/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "is_fair_booth",
            "name": "isFairBooth",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "cover_image",
            "name": "coverImage",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "kind",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "exhibition_period",
            "name": "exhibitionPeriod",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "status_update",
            "name": "statusUpdate",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": (v8/*: any*/)
              },
              {
                "kind": "InlineFragment",
                "type": "ExternalPartner",
                "selections": (v8/*: any*/)
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "city",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  }
],
v10 = [
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
    "name": "ArtistBelowTheFoldQuery",
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
            "name": "ArtistAbout_artist",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "ArtistShows_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistBelowTheFoldQuery",
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
            "alias": "has_metadata",
            "name": "hasMetadata",
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
          (v2/*: any*/),
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
            "name": "targetSupply",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistTargetSupply",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isInMicrofunnel",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
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
                "kind": "LinkedField",
                "alias": null,
                "name": "cropped",
                "storageKey": "cropped(height:66,width:66)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 66
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 66
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
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
                          (v5/*: any*/),
                          (v3/*: any*/),
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
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "artworks",
                                "args": null,
                                "storageKey": null
                              }
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
                            "selections": (v6/*: any*/)
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
              (v7/*: any*/)
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
                      (v5/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Author",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v4/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "thumbnail_image",
                        "name": "thumbnailImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": (v6/*: any*/)
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
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v9/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "upcomingShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"upcoming\")",
            "args": [
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": (v9/*: any*/)
          },
          (v4/*: any*/),
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
                "args": (v10/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": (v9/*: any*/)
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
                "args": (v10/*: any*/),
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": (v9/*: any*/)
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistBelowTheFoldQuery",
    "id": "ac253aeb550888b6b5e561837286c242",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8f1acae86c8252fd25a3994376dbbc4f';
export default node;
