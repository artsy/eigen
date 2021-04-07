/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cf0e0472d825ab2c462e22425908f882 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAboutTestsQueryVariables = {
    artistID: string;
};
export type ArtistAboutTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistAbout_artist">;
    } | null;
};
export type ArtistAboutTestsQuery = {
    readonly response: ArtistAboutTestsQueryResponse;
    readonly variables: ArtistAboutTestsQueryVariables;
};



/*
query ArtistAboutTestsQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    ...ArtistAbout_artist
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

fragment ArtistAboutShows_artist on Artist {
  name
  slug
  currentShows: showsConnection(status: "running", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  upcomingShows: showsConnection(status: "upcoming", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  pastShows: showsConnection(status: "closed", first: 3) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
}

fragment ArtistAbout_artist on Artist {
  hasMetadata
  isDisplayAuctionLink
  slug
  ...Biography_artist
  ...ArtistConsignButton_artist
  ...ArtistAboutShows_artist
  ...ArtistCollectionsRail_artist
  iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
    ...ArtistCollectionsRail_collections
    id
  }
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

fragment ArtistCollectionsRail_artist on Artist {
  internalID
  slug
}

fragment ArtistCollectionsRail_collections on MarketingCollection {
  slug
  id
  title
  priceGuidance
  artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
    edges {
      node {
        title
        image {
          url
        }
        id
      }
    }
    id
  }
}

fragment ArtistConsignButton_artist on Artist {
  targetSupply {
    isInMicrofunnel
    isTargetSupply
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
      __isNode: __typename
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistID"
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
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = [
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
  }
],
v9 = [
  (v3/*: any*/),
  (v6/*: any*/)
],
v10 = [
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
          (v6/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
          {
            "alias": "is_fair_booth",
            "args": null,
            "kind": "ScalarField",
            "name": "isFairBooth",
            "storageKey": null
          },
          {
            "alias": "cover_image",
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "kind",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": "exhibition_period",
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": "status_update",
            "args": null,
            "kind": "ScalarField",
            "name": "statusUpdate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v9/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v6/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              (v6/*: any*/)
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
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v13 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ShowConnection"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ShowEdge"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Show"
},
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "PartnerTypes"
},
v23 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistAboutTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistAbout_artist"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistAboutTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasMetadata",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isDisplayAuctionLink",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "blurb",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistTargetSupply",
            "kind": "LinkedField",
            "name": "targetSupply",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isInMicrofunnel",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isTargetSupply",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
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
                "kind": "LinkedField",
                "name": "cropped",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "cropped(height:66,width:66)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "currentShows",
            "args": [
              (v5/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v5/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"upcoming\")"
          },
          {
            "alias": "pastShows",
            "args": [
              (v11/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "closed"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": "showsConnection(first:3,status:\"closed\")"
          },
          {
            "alias": "iconicCollections",
            "args": [
              {
                "kind": "Literal",
                "name": "isFeaturedArtistContent",
                "value": true
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 16
              }
            ],
            "concreteType": "MarketingCollection",
            "kind": "LinkedField",
            "name": "marketingCollections",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v6/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "priceGuidance",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "aggregations",
                    "value": [
                      "TOTAL"
                    ]
                  },
                  (v11/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "-decayed_merch"
                  }
                ],
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "artworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FilterArtworksEdge",
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
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v4/*: any*/),
                            "storageKey": null
                          },
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
              }
            ],
            "storageKey": "marketingCollections(isFeaturedArtistContent:true,size:16)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "kind": "LinkedField",
            "name": "related",
            "plural": false,
            "selections": [
              {
                "alias": "artists",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 16
                  }
                ],
                "concreteType": "ArtistConnection",
                "kind": "LinkedField",
                "name": "artistsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "forSaleArtworks",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artworks",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistsConnection(first:16)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "articles",
            "args": [
              (v5/*: any*/)
            ],
            "concreteType": "ArticleConnection",
            "kind": "LinkedField",
            "name": "articlesConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArticleEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Article",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": "thumbnail_title",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailTitle",
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Author",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": (v9/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "thumbnail_image",
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "thumbnailImage",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "articlesConnection(first:10)"
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "cf0e0472d825ab2c462e22425908f882",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": (v13/*: any*/),
        "artist.articles": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArticleConnection"
        },
        "artist.articles.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArticleEdge"
        },
        "artist.articles.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Article"
        },
        "artist.articles.edges.node.author": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Author"
        },
        "artist.articles.edges.node.author.id": (v14/*: any*/),
        "artist.articles.edges.node.author.name": (v15/*: any*/),
        "artist.articles.edges.node.href": (v15/*: any*/),
        "artist.articles.edges.node.id": (v14/*: any*/),
        "artist.articles.edges.node.thumbnail_image": (v16/*: any*/),
        "artist.articles.edges.node.thumbnail_image.url": (v15/*: any*/),
        "artist.articles.edges.node.thumbnail_title": (v15/*: any*/),
        "artist.bio": (v15/*: any*/),
        "artist.blurb": (v15/*: any*/),
        "artist.currentShows": (v17/*: any*/),
        "artist.currentShows.edges": (v18/*: any*/),
        "artist.currentShows.edges.node": (v19/*: any*/),
        "artist.currentShows.edges.node.cover_image": (v16/*: any*/),
        "artist.currentShows.edges.node.cover_image.url": (v15/*: any*/),
        "artist.currentShows.edges.node.exhibition_period": (v15/*: any*/),
        "artist.currentShows.edges.node.href": (v15/*: any*/),
        "artist.currentShows.edges.node.id": (v14/*: any*/),
        "artist.currentShows.edges.node.is_fair_booth": (v20/*: any*/),
        "artist.currentShows.edges.node.kind": (v15/*: any*/),
        "artist.currentShows.edges.node.location": (v21/*: any*/),
        "artist.currentShows.edges.node.location.city": (v15/*: any*/),
        "artist.currentShows.edges.node.location.id": (v14/*: any*/),
        "artist.currentShows.edges.node.name": (v15/*: any*/),
        "artist.currentShows.edges.node.partner": (v22/*: any*/),
        "artist.currentShows.edges.node.partner.__isNode": (v23/*: any*/),
        "artist.currentShows.edges.node.partner.__typename": (v23/*: any*/),
        "artist.currentShows.edges.node.partner.id": (v14/*: any*/),
        "artist.currentShows.edges.node.partner.name": (v15/*: any*/),
        "artist.currentShows.edges.node.slug": (v14/*: any*/),
        "artist.currentShows.edges.node.status": (v15/*: any*/),
        "artist.currentShows.edges.node.status_update": (v15/*: any*/),
        "artist.hasMetadata": (v20/*: any*/),
        "artist.iconicCollections": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "MarketingCollection"
        },
        "artist.iconicCollections.artworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "artist.iconicCollections.artworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "FilterArtworksEdge"
        },
        "artist.iconicCollections.artworksConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artist.iconicCollections.artworksConnection.edges.node.id": (v14/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.image": (v16/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.image.url": (v15/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.title": (v15/*: any*/),
        "artist.iconicCollections.artworksConnection.id": (v14/*: any*/),
        "artist.iconicCollections.id": (v14/*: any*/),
        "artist.iconicCollections.priceGuidance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "artist.iconicCollections.slug": (v23/*: any*/),
        "artist.iconicCollections.title": (v23/*: any*/),
        "artist.id": (v14/*: any*/),
        "artist.image": (v16/*: any*/),
        "artist.image.cropped": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CroppedImageUrl"
        },
        "artist.image.cropped.url": (v23/*: any*/),
        "artist.internalID": (v14/*: any*/),
        "artist.isDisplayAuctionLink": (v20/*: any*/),
        "artist.name": (v15/*: any*/),
        "artist.pastShows": (v17/*: any*/),
        "artist.pastShows.edges": (v18/*: any*/),
        "artist.pastShows.edges.node": (v19/*: any*/),
        "artist.pastShows.edges.node.cover_image": (v16/*: any*/),
        "artist.pastShows.edges.node.cover_image.url": (v15/*: any*/),
        "artist.pastShows.edges.node.exhibition_period": (v15/*: any*/),
        "artist.pastShows.edges.node.href": (v15/*: any*/),
        "artist.pastShows.edges.node.id": (v14/*: any*/),
        "artist.pastShows.edges.node.is_fair_booth": (v20/*: any*/),
        "artist.pastShows.edges.node.kind": (v15/*: any*/),
        "artist.pastShows.edges.node.location": (v21/*: any*/),
        "artist.pastShows.edges.node.location.city": (v15/*: any*/),
        "artist.pastShows.edges.node.location.id": (v14/*: any*/),
        "artist.pastShows.edges.node.name": (v15/*: any*/),
        "artist.pastShows.edges.node.partner": (v22/*: any*/),
        "artist.pastShows.edges.node.partner.__isNode": (v23/*: any*/),
        "artist.pastShows.edges.node.partner.__typename": (v23/*: any*/),
        "artist.pastShows.edges.node.partner.id": (v14/*: any*/),
        "artist.pastShows.edges.node.partner.name": (v15/*: any*/),
        "artist.pastShows.edges.node.slug": (v14/*: any*/),
        "artist.pastShows.edges.node.status": (v15/*: any*/),
        "artist.pastShows.edges.node.status_update": (v15/*: any*/),
        "artist.related": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistRelatedData"
        },
        "artist.related.artists": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistConnection"
        },
        "artist.related.artists.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtistEdge"
        },
        "artist.related.artists.edges.node": (v13/*: any*/),
        "artist.related.artists.edges.node.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistCounts"
        },
        "artist.related.artists.edges.node.counts.artworks": (v24/*: any*/),
        "artist.related.artists.edges.node.counts.forSaleArtworks": (v24/*: any*/),
        "artist.related.artists.edges.node.href": (v15/*: any*/),
        "artist.related.artists.edges.node.id": (v14/*: any*/),
        "artist.related.artists.edges.node.image": (v16/*: any*/),
        "artist.related.artists.edges.node.image.url": (v15/*: any*/),
        "artist.related.artists.edges.node.name": (v15/*: any*/),
        "artist.slug": (v14/*: any*/),
        "artist.targetSupply": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistTargetSupply"
        },
        "artist.targetSupply.isInMicrofunnel": (v20/*: any*/),
        "artist.targetSupply.isTargetSupply": (v20/*: any*/),
        "artist.upcomingShows": (v17/*: any*/),
        "artist.upcomingShows.edges": (v18/*: any*/),
        "artist.upcomingShows.edges.node": (v19/*: any*/),
        "artist.upcomingShows.edges.node.cover_image": (v16/*: any*/),
        "artist.upcomingShows.edges.node.cover_image.url": (v15/*: any*/),
        "artist.upcomingShows.edges.node.exhibition_period": (v15/*: any*/),
        "artist.upcomingShows.edges.node.href": (v15/*: any*/),
        "artist.upcomingShows.edges.node.id": (v14/*: any*/),
        "artist.upcomingShows.edges.node.is_fair_booth": (v20/*: any*/),
        "artist.upcomingShows.edges.node.kind": (v15/*: any*/),
        "artist.upcomingShows.edges.node.location": (v21/*: any*/),
        "artist.upcomingShows.edges.node.location.city": (v15/*: any*/),
        "artist.upcomingShows.edges.node.location.id": (v14/*: any*/),
        "artist.upcomingShows.edges.node.name": (v15/*: any*/),
        "artist.upcomingShows.edges.node.partner": (v22/*: any*/),
        "artist.upcomingShows.edges.node.partner.__isNode": (v23/*: any*/),
        "artist.upcomingShows.edges.node.partner.__typename": (v23/*: any*/),
        "artist.upcomingShows.edges.node.partner.id": (v14/*: any*/),
        "artist.upcomingShows.edges.node.partner.name": (v15/*: any*/),
        "artist.upcomingShows.edges.node.slug": (v14/*: any*/),
        "artist.upcomingShows.edges.node.status": (v15/*: any*/),
        "artist.upcomingShows.edges.node.status_update": (v15/*: any*/)
      }
    },
    "name": "ArtistAboutTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c72c24d942a4c8891c7123da929e4bab';
export default node;
