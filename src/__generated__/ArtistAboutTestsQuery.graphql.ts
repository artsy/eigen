/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 43a164aa6fee39b0305122de60697a05 */

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
  slug
  ...Biography_artist
  ...ArtistConsignButton_artist
  ...ArtistAboutShows_artist
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
v4 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v7 = [
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
v8 = [
  (v3/*: any*/),
  (v5/*: any*/)
],
v9 = [
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
          (v5/*: any*/),
          (v2/*: any*/),
          (v6/*: any*/),
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
            "selections": (v7/*: any*/),
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
                "selections": (v8/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v5/*: any*/)
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
              (v5/*: any*/)
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
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v11 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v13 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ShowConnection"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ShowEdge"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Show"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "PartnerTypes"
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v21 = {
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
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  }
                ],
                "storageKey": "cropped(height:66,width:66)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "currentShows",
            "args": [
              (v4/*: any*/),
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
            "selections": (v9/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v4/*: any*/),
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
            "selections": (v9/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"upcoming\")"
          },
          {
            "alias": "pastShows",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              },
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
            "selections": (v9/*: any*/),
            "storageKey": "showsConnection(first:3,status:\"closed\")"
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
                          (v5/*: any*/),
                          (v6/*: any*/),
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
                            "selections": (v7/*: any*/),
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
              (v4/*: any*/)
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
                      (v5/*: any*/),
                      {
                        "alias": "thumbnail_title",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailTitle",
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Author",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "thumbnail_image",
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "thumbnailImage",
                        "plural": false,
                        "selections": (v7/*: any*/),
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
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "43a164aa6fee39b0305122de60697a05",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": (v10/*: any*/),
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
        "artist.articles.edges.node.author.id": (v11/*: any*/),
        "artist.articles.edges.node.author.name": (v12/*: any*/),
        "artist.articles.edges.node.href": (v12/*: any*/),
        "artist.articles.edges.node.id": (v11/*: any*/),
        "artist.articles.edges.node.thumbnail_image": (v13/*: any*/),
        "artist.articles.edges.node.thumbnail_image.url": (v12/*: any*/),
        "artist.articles.edges.node.thumbnail_title": (v12/*: any*/),
        "artist.bio": (v12/*: any*/),
        "artist.blurb": (v12/*: any*/),
        "artist.currentShows": (v14/*: any*/),
        "artist.currentShows.edges": (v15/*: any*/),
        "artist.currentShows.edges.node": (v16/*: any*/),
        "artist.currentShows.edges.node.cover_image": (v13/*: any*/),
        "artist.currentShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.currentShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.currentShows.edges.node.href": (v12/*: any*/),
        "artist.currentShows.edges.node.id": (v11/*: any*/),
        "artist.currentShows.edges.node.is_fair_booth": (v17/*: any*/),
        "artist.currentShows.edges.node.kind": (v12/*: any*/),
        "artist.currentShows.edges.node.location": (v18/*: any*/),
        "artist.currentShows.edges.node.location.city": (v12/*: any*/),
        "artist.currentShows.edges.node.location.id": (v11/*: any*/),
        "artist.currentShows.edges.node.name": (v12/*: any*/),
        "artist.currentShows.edges.node.partner": (v19/*: any*/),
        "artist.currentShows.edges.node.partner.__isNode": (v20/*: any*/),
        "artist.currentShows.edges.node.partner.__typename": (v20/*: any*/),
        "artist.currentShows.edges.node.partner.id": (v11/*: any*/),
        "artist.currentShows.edges.node.partner.name": (v12/*: any*/),
        "artist.currentShows.edges.node.slug": (v11/*: any*/),
        "artist.currentShows.edges.node.status": (v12/*: any*/),
        "artist.currentShows.edges.node.status_update": (v12/*: any*/),
        "artist.hasMetadata": (v17/*: any*/),
        "artist.id": (v11/*: any*/),
        "artist.image": (v13/*: any*/),
        "artist.image.cropped": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CroppedImageUrl"
        },
        "artist.image.cropped.url": (v20/*: any*/),
        "artist.internalID": (v11/*: any*/),
        "artist.name": (v12/*: any*/),
        "artist.pastShows": (v14/*: any*/),
        "artist.pastShows.edges": (v15/*: any*/),
        "artist.pastShows.edges.node": (v16/*: any*/),
        "artist.pastShows.edges.node.cover_image": (v13/*: any*/),
        "artist.pastShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.pastShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.pastShows.edges.node.href": (v12/*: any*/),
        "artist.pastShows.edges.node.id": (v11/*: any*/),
        "artist.pastShows.edges.node.is_fair_booth": (v17/*: any*/),
        "artist.pastShows.edges.node.kind": (v12/*: any*/),
        "artist.pastShows.edges.node.location": (v18/*: any*/),
        "artist.pastShows.edges.node.location.city": (v12/*: any*/),
        "artist.pastShows.edges.node.location.id": (v11/*: any*/),
        "artist.pastShows.edges.node.name": (v12/*: any*/),
        "artist.pastShows.edges.node.partner": (v19/*: any*/),
        "artist.pastShows.edges.node.partner.__isNode": (v20/*: any*/),
        "artist.pastShows.edges.node.partner.__typename": (v20/*: any*/),
        "artist.pastShows.edges.node.partner.id": (v11/*: any*/),
        "artist.pastShows.edges.node.partner.name": (v12/*: any*/),
        "artist.pastShows.edges.node.slug": (v11/*: any*/),
        "artist.pastShows.edges.node.status": (v12/*: any*/),
        "artist.pastShows.edges.node.status_update": (v12/*: any*/),
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
        "artist.related.artists.edges.node": (v10/*: any*/),
        "artist.related.artists.edges.node.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistCounts"
        },
        "artist.related.artists.edges.node.counts.artworks": (v21/*: any*/),
        "artist.related.artists.edges.node.counts.forSaleArtworks": (v21/*: any*/),
        "artist.related.artists.edges.node.href": (v12/*: any*/),
        "artist.related.artists.edges.node.id": (v11/*: any*/),
        "artist.related.artists.edges.node.image": (v13/*: any*/),
        "artist.related.artists.edges.node.image.url": (v12/*: any*/),
        "artist.related.artists.edges.node.name": (v12/*: any*/),
        "artist.slug": (v11/*: any*/),
        "artist.targetSupply": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistTargetSupply"
        },
        "artist.targetSupply.isInMicrofunnel": (v17/*: any*/),
        "artist.targetSupply.isTargetSupply": (v17/*: any*/),
        "artist.upcomingShows": (v14/*: any*/),
        "artist.upcomingShows.edges": (v15/*: any*/),
        "artist.upcomingShows.edges.node": (v16/*: any*/),
        "artist.upcomingShows.edges.node.cover_image": (v13/*: any*/),
        "artist.upcomingShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.upcomingShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.upcomingShows.edges.node.href": (v12/*: any*/),
        "artist.upcomingShows.edges.node.id": (v11/*: any*/),
        "artist.upcomingShows.edges.node.is_fair_booth": (v17/*: any*/),
        "artist.upcomingShows.edges.node.kind": (v12/*: any*/),
        "artist.upcomingShows.edges.node.location": (v18/*: any*/),
        "artist.upcomingShows.edges.node.location.city": (v12/*: any*/),
        "artist.upcomingShows.edges.node.location.id": (v11/*: any*/),
        "artist.upcomingShows.edges.node.name": (v12/*: any*/),
        "artist.upcomingShows.edges.node.partner": (v19/*: any*/),
        "artist.upcomingShows.edges.node.partner.__isNode": (v20/*: any*/),
        "artist.upcomingShows.edges.node.partner.__typename": (v20/*: any*/),
        "artist.upcomingShows.edges.node.partner.id": (v11/*: any*/),
        "artist.upcomingShows.edges.node.partner.name": (v12/*: any*/),
        "artist.upcomingShows.edges.node.slug": (v11/*: any*/),
        "artist.upcomingShows.edges.node.status": (v12/*: any*/),
        "artist.upcomingShows.edges.node.status_update": (v12/*: any*/)
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
