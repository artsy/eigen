/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b4012d2dfba16e62157f2bd5dbbb4a4c */

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
  internalID
  slug
  ...Biography_artist
  ...ArtistSeriesMoreSeries_artist
  ...ArtistNotableWorksRail_artist
  notableWorks: filterArtworksConnection(first: 3, input: {sort: "-weighted_iconicity"}) {
    edges {
      node {
        id
      }
    }
    id
  }
  ...ArtistCollectionsRail_artist
  iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
    ...ArtistCollectionsRail_collections
    id
  }
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
  articles: articlesConnection(first: 10, inEditorialFeed: true) {
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

fragment ArtistNotableWorksRail_artist on Artist {
  internalID
  slug
  filterArtworksConnection(first: 10, input: {sort: "-weighted_iconicity"}) {
    edges {
      node {
        id
        image {
          imageURL
          aspectRatio
        }
        saleMessage
        saleArtwork {
          openingBid {
            display
          }
          highestBid {
            display
          }
          id
        }
        sale {
          isClosed
          isAuction
          id
        }
        title
        internalID
        slug
      }
    }
    id
  }
}

fragment ArtistSeriesMoreSeries_artist on Artist {
  internalID
  slug
  artistSeriesConnection(first: 4) {
    totalCount
    edges {
      node {
        slug
        internalID
        title
        featured
        artworksCountMessage
        image {
          url
        }
      }
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
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v8 = {
  "kind": "Literal",
  "name": "input",
  "value": {
    "sort": "-weighted_iconicity"
  }
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v12 = [
  (v9/*: any*/)
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v15 = [
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
v16 = [
  (v13/*: any*/),
  (v9/*: any*/)
],
v17 = [
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
          (v9/*: any*/),
          (v3/*: any*/),
          (v14/*: any*/),
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
            "selections": (v15/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "kind",
            "storageKey": null
          },
          (v13/*: any*/),
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
                  (v13/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v16/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v12/*: any*/),
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
              (v9/*: any*/)
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
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v19 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v22 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ShowConnection"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ShowEdge"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Show"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "PartnerTypes"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksConnection"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FilterArtworksEdge"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v32 = {
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
          (v3/*: any*/),
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
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 4
              }
            ],
            "concreteType": "ArtistSeriesConnection",
            "kind": "LinkedField",
            "name": "artistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "featured",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "artworksCountMessage",
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
            "storageKey": "artistSeriesConnection(first:4)"
          },
          {
            "alias": null,
            "args": [
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
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
                      (v9/*: any*/),
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
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageURL",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "saleMessage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtworkOpeningBid",
                            "kind": "LinkedField",
                            "name": "openingBid",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtworkHighestBid",
                            "kind": "LinkedField",
                            "name": "highestBid",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Sale",
                        "kind": "LinkedField",
                        "name": "sale",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isClosed",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isAuction",
                            "storageKey": null
                          },
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:10,input:{\"sort\":\"-weighted_iconicity\"})"
          },
          {
            "alias": "notableWorks",
            "args": [
              (v11/*: any*/),
              (v8/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
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
                    "selections": (v12/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:3,input:{\"sort\":\"-weighted_iconicity\"})"
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
              (v3/*: any*/),
              (v9/*: any*/),
              (v4/*: any*/),
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
                          (v4/*: any*/),
                          (v6/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/)
                ],
                "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
              }
            ],
            "storageKey": "marketingCollections(isFeaturedArtistContent:true,size:16)"
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
          (v13/*: any*/),
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
                "selections": (v5/*: any*/),
                "storageKey": "cropped(height:66,width:66)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "currentShows",
            "args": [
              (v7/*: any*/),
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
            "selections": (v17/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v7/*: any*/),
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
            "selections": (v17/*: any*/),
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
            "selections": (v17/*: any*/),
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
                          (v9/*: any*/),
                          (v14/*: any*/),
                          (v13/*: any*/),
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
                            "selections": (v15/*: any*/),
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
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "inEditorialFeed",
                "value": true
              }
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
                      (v9/*: any*/),
                      {
                        "alias": "thumbnail_title",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailTitle",
                        "storageKey": null
                      },
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Author",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": (v16/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "thumbnail_image",
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "thumbnailImage",
                        "plural": false,
                        "selections": (v15/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "articlesConnection(first:10,inEditorialFeed:true)"
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b4012d2dfba16e62157f2bd5dbbb4a4c",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": (v18/*: any*/),
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
        "artist.articles.edges.node.author.id": (v19/*: any*/),
        "artist.articles.edges.node.author.name": (v20/*: any*/),
        "artist.articles.edges.node.href": (v20/*: any*/),
        "artist.articles.edges.node.id": (v19/*: any*/),
        "artist.articles.edges.node.thumbnail_image": (v21/*: any*/),
        "artist.articles.edges.node.thumbnail_image.url": (v20/*: any*/),
        "artist.articles.edges.node.thumbnail_title": (v20/*: any*/),
        "artist.artistSeriesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistSeriesConnection"
        },
        "artist.artistSeriesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtistSeriesEdge"
        },
        "artist.artistSeriesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistSeries"
        },
        "artist.artistSeriesConnection.edges.node.artworksCountMessage": (v20/*: any*/),
        "artist.artistSeriesConnection.edges.node.featured": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "artist.artistSeriesConnection.edges.node.image": (v21/*: any*/),
        "artist.artistSeriesConnection.edges.node.image.url": (v20/*: any*/),
        "artist.artistSeriesConnection.edges.node.internalID": (v19/*: any*/),
        "artist.artistSeriesConnection.edges.node.slug": (v22/*: any*/),
        "artist.artistSeriesConnection.edges.node.title": (v22/*: any*/),
        "artist.artistSeriesConnection.totalCount": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "artist.bio": (v20/*: any*/),
        "artist.blurb": (v20/*: any*/),
        "artist.currentShows": (v23/*: any*/),
        "artist.currentShows.edges": (v24/*: any*/),
        "artist.currentShows.edges.node": (v25/*: any*/),
        "artist.currentShows.edges.node.cover_image": (v21/*: any*/),
        "artist.currentShows.edges.node.cover_image.url": (v20/*: any*/),
        "artist.currentShows.edges.node.exhibition_period": (v20/*: any*/),
        "artist.currentShows.edges.node.href": (v20/*: any*/),
        "artist.currentShows.edges.node.id": (v19/*: any*/),
        "artist.currentShows.edges.node.is_fair_booth": (v26/*: any*/),
        "artist.currentShows.edges.node.kind": (v20/*: any*/),
        "artist.currentShows.edges.node.location": (v27/*: any*/),
        "artist.currentShows.edges.node.location.city": (v20/*: any*/),
        "artist.currentShows.edges.node.location.id": (v19/*: any*/),
        "artist.currentShows.edges.node.name": (v20/*: any*/),
        "artist.currentShows.edges.node.partner": (v28/*: any*/),
        "artist.currentShows.edges.node.partner.__isNode": (v22/*: any*/),
        "artist.currentShows.edges.node.partner.__typename": (v22/*: any*/),
        "artist.currentShows.edges.node.partner.id": (v19/*: any*/),
        "artist.currentShows.edges.node.partner.name": (v20/*: any*/),
        "artist.currentShows.edges.node.slug": (v19/*: any*/),
        "artist.currentShows.edges.node.status": (v20/*: any*/),
        "artist.currentShows.edges.node.status_update": (v20/*: any*/),
        "artist.filterArtworksConnection": (v29/*: any*/),
        "artist.filterArtworksConnection.edges": (v30/*: any*/),
        "artist.filterArtworksConnection.edges.node": (v31/*: any*/),
        "artist.filterArtworksConnection.edges.node.id": (v19/*: any*/),
        "artist.filterArtworksConnection.edges.node.image": (v21/*: any*/),
        "artist.filterArtworksConnection.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "artist.filterArtworksConnection.edges.node.image.imageURL": (v20/*: any*/),
        "artist.filterArtworksConnection.edges.node.internalID": (v19/*: any*/),
        "artist.filterArtworksConnection.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "artist.filterArtworksConnection.edges.node.sale.id": (v19/*: any*/),
        "artist.filterArtworksConnection.edges.node.sale.isAuction": (v26/*: any*/),
        "artist.filterArtworksConnection.edges.node.sale.isClosed": (v26/*: any*/),
        "artist.filterArtworksConnection.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "artist.filterArtworksConnection.edges.node.saleArtwork.highestBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkHighestBid"
        },
        "artist.filterArtworksConnection.edges.node.saleArtwork.highestBid.display": (v20/*: any*/),
        "artist.filterArtworksConnection.edges.node.saleArtwork.id": (v19/*: any*/),
        "artist.filterArtworksConnection.edges.node.saleArtwork.openingBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkOpeningBid"
        },
        "artist.filterArtworksConnection.edges.node.saleArtwork.openingBid.display": (v20/*: any*/),
        "artist.filterArtworksConnection.edges.node.saleMessage": (v20/*: any*/),
        "artist.filterArtworksConnection.edges.node.slug": (v19/*: any*/),
        "artist.filterArtworksConnection.edges.node.title": (v20/*: any*/),
        "artist.filterArtworksConnection.id": (v19/*: any*/),
        "artist.hasMetadata": (v26/*: any*/),
        "artist.iconicCollections": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "MarketingCollection"
        },
        "artist.iconicCollections.artworksConnection": (v29/*: any*/),
        "artist.iconicCollections.artworksConnection.edges": (v30/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node": (v31/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.id": (v19/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.image": (v21/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.image.url": (v20/*: any*/),
        "artist.iconicCollections.artworksConnection.edges.node.title": (v20/*: any*/),
        "artist.iconicCollections.artworksConnection.id": (v19/*: any*/),
        "artist.iconicCollections.id": (v19/*: any*/),
        "artist.iconicCollections.priceGuidance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "artist.iconicCollections.slug": (v22/*: any*/),
        "artist.iconicCollections.title": (v22/*: any*/),
        "artist.id": (v19/*: any*/),
        "artist.image": (v21/*: any*/),
        "artist.image.cropped": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CroppedImageUrl"
        },
        "artist.image.cropped.url": (v22/*: any*/),
        "artist.internalID": (v19/*: any*/),
        "artist.name": (v20/*: any*/),
        "artist.notableWorks": (v29/*: any*/),
        "artist.notableWorks.edges": (v30/*: any*/),
        "artist.notableWorks.edges.node": (v31/*: any*/),
        "artist.notableWorks.edges.node.id": (v19/*: any*/),
        "artist.notableWorks.id": (v19/*: any*/),
        "artist.pastShows": (v23/*: any*/),
        "artist.pastShows.edges": (v24/*: any*/),
        "artist.pastShows.edges.node": (v25/*: any*/),
        "artist.pastShows.edges.node.cover_image": (v21/*: any*/),
        "artist.pastShows.edges.node.cover_image.url": (v20/*: any*/),
        "artist.pastShows.edges.node.exhibition_period": (v20/*: any*/),
        "artist.pastShows.edges.node.href": (v20/*: any*/),
        "artist.pastShows.edges.node.id": (v19/*: any*/),
        "artist.pastShows.edges.node.is_fair_booth": (v26/*: any*/),
        "artist.pastShows.edges.node.kind": (v20/*: any*/),
        "artist.pastShows.edges.node.location": (v27/*: any*/),
        "artist.pastShows.edges.node.location.city": (v20/*: any*/),
        "artist.pastShows.edges.node.location.id": (v19/*: any*/),
        "artist.pastShows.edges.node.name": (v20/*: any*/),
        "artist.pastShows.edges.node.partner": (v28/*: any*/),
        "artist.pastShows.edges.node.partner.__isNode": (v22/*: any*/),
        "artist.pastShows.edges.node.partner.__typename": (v22/*: any*/),
        "artist.pastShows.edges.node.partner.id": (v19/*: any*/),
        "artist.pastShows.edges.node.partner.name": (v20/*: any*/),
        "artist.pastShows.edges.node.slug": (v19/*: any*/),
        "artist.pastShows.edges.node.status": (v20/*: any*/),
        "artist.pastShows.edges.node.status_update": (v20/*: any*/),
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
        "artist.related.artists.edges.node": (v18/*: any*/),
        "artist.related.artists.edges.node.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistCounts"
        },
        "artist.related.artists.edges.node.counts.artworks": (v32/*: any*/),
        "artist.related.artists.edges.node.counts.forSaleArtworks": (v32/*: any*/),
        "artist.related.artists.edges.node.href": (v20/*: any*/),
        "artist.related.artists.edges.node.id": (v19/*: any*/),
        "artist.related.artists.edges.node.image": (v21/*: any*/),
        "artist.related.artists.edges.node.image.url": (v20/*: any*/),
        "artist.related.artists.edges.node.name": (v20/*: any*/),
        "artist.slug": (v19/*: any*/),
        "artist.targetSupply": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistTargetSupply"
        },
        "artist.targetSupply.isInMicrofunnel": (v26/*: any*/),
        "artist.targetSupply.isTargetSupply": (v26/*: any*/),
        "artist.upcomingShows": (v23/*: any*/),
        "artist.upcomingShows.edges": (v24/*: any*/),
        "artist.upcomingShows.edges.node": (v25/*: any*/),
        "artist.upcomingShows.edges.node.cover_image": (v21/*: any*/),
        "artist.upcomingShows.edges.node.cover_image.url": (v20/*: any*/),
        "artist.upcomingShows.edges.node.exhibition_period": (v20/*: any*/),
        "artist.upcomingShows.edges.node.href": (v20/*: any*/),
        "artist.upcomingShows.edges.node.id": (v19/*: any*/),
        "artist.upcomingShows.edges.node.is_fair_booth": (v26/*: any*/),
        "artist.upcomingShows.edges.node.kind": (v20/*: any*/),
        "artist.upcomingShows.edges.node.location": (v27/*: any*/),
        "artist.upcomingShows.edges.node.location.city": (v20/*: any*/),
        "artist.upcomingShows.edges.node.location.id": (v19/*: any*/),
        "artist.upcomingShows.edges.node.name": (v20/*: any*/),
        "artist.upcomingShows.edges.node.partner": (v28/*: any*/),
        "artist.upcomingShows.edges.node.partner.__isNode": (v22/*: any*/),
        "artist.upcomingShows.edges.node.partner.__typename": (v22/*: any*/),
        "artist.upcomingShows.edges.node.partner.id": (v19/*: any*/),
        "artist.upcomingShows.edges.node.partner.name": (v20/*: any*/),
        "artist.upcomingShows.edges.node.slug": (v19/*: any*/),
        "artist.upcomingShows.edges.node.status": (v20/*: any*/),
        "artist.upcomingShows.edges.node.status_update": (v20/*: any*/)
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
