/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b3515f0860386634d83c66112c169cad */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "ARTIST_NATIONALITY" | "ATTRIBUTION_CLASS" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "LOCATION_CITY" | "MAJOR_PERIOD" | "MATERIALS_TERMS" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type ArtworkSizes = "LARGE" | "MEDIUM" | "SMALL" | "%future added value";
export type FilterArtworksInput = {
    acquireable?: boolean | null;
    additionalGeneIDs?: Array<string | null> | null;
    after?: string | null;
    aggregationPartnerCities?: Array<string | null> | null;
    aggregations?: Array<ArtworkAggregation | null> | null;
    artistID?: string | null;
    artistIDs?: Array<string | null> | null;
    artistNationalities?: Array<string | null> | null;
    artistSeriesID?: string | null;
    atAuction?: boolean | null;
    attributionClass?: Array<string | null> | null;
    before?: string | null;
    color?: string | null;
    colors?: Array<string | null> | null;
    dimensionRange?: string | null;
    excludeArtworkIDs?: Array<string | null> | null;
    extraAggregationGeneIDs?: Array<string | null> | null;
    first?: number | null;
    forSale?: boolean | null;
    geneID?: string | null;
    geneIDs?: Array<string | null> | null;
    height?: string | null;
    includeArtworksByFollowedArtists?: boolean | null;
    includeMediumFilterInAggregation?: boolean | null;
    inquireableOnly?: boolean | null;
    keyword?: string | null;
    keywordMatchExact?: boolean | null;
    last?: number | null;
    locationCities?: Array<string | null> | null;
    majorPeriods?: Array<string | null> | null;
    marketable?: boolean | null;
    materialsTerms?: Array<string | null> | null;
    medium?: string | null;
    offerable?: boolean | null;
    page?: number | null;
    partnerCities?: Array<string | null> | null;
    partnerID?: string | null;
    partnerIDs?: Array<string | null> | null;
    period?: string | null;
    periods?: Array<string | null> | null;
    priceRange?: string | null;
    saleID?: string | null;
    size?: number | null;
    sizes?: Array<ArtworkSizes | null> | null;
    sort?: string | null;
    tagID?: string | null;
    width?: string | null;
};
export type TagTestsQueryVariables = {
    tagID: string;
    input?: FilterArtworksInput | null;
};
export type TagTestsQueryResponse = {
    readonly tag: {
        readonly slug: string;
        readonly description: string | null;
        readonly " $fragmentRefs": FragmentRefs<"TagHeader_tag" | "About_tag" | "TagArtworks_tag">;
    } | null;
};
export type TagTestsQuery = {
    readonly response: TagTestsQueryResponse;
    readonly variables: TagTestsQueryVariables;
};



/*
query TagTestsQuery(
  $tagID: String!
  $input: FilterArtworksInput
) {
  tag(id: $tagID) {
    slug
    description
    ...TagHeader_tag
    ...About_tag
    ...TagArtworks_tag_2VV6jB
    id
  }
}

fragment About_tag on Tag {
  description
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
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
      ...MyCollectionArtworkListItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  internalID
  artist {
    internalID
    id
  }
  images {
    url
    isDefault
  }
  image {
    aspectRatio
  }
  artistNames
  medium
  slug
  title
  date
}

fragment TagArtworks_tag_2VV6jB on Tag {
  id
  internalID
  slug
  artworks: filterArtworksConnection(first: 10, after: "", aggregations: [LOCATION_CITY, ARTIST_NATIONALITY, PRICE_RANGE, COLOR, DIMENSION_RANGE, PARTNER, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, ARTIST, LOCATION_CITY, MATERIALS_TERMS], input: $input) {
    counts {
      total
    }
    aggregations {
      slice
      counts {
        value
        name
        count
      }
    }
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

fragment TagHeader_tag on Tag {
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "tagID"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "tagID"
  }
],
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
  "name": "description",
  "storageKey": null
},
v5 = {
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v9 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "LOCATION_CITY",
      "ARTIST_NATIONALITY",
      "PRICE_RANGE",
      "COLOR",
      "DIMENSION_RANGE",
      "PARTNER",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE",
      "ARTIST",
      "LOCATION_CITY",
      "MATERIALS_TERMS"
    ]
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v5/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TagTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Tag",
        "kind": "LinkedField",
        "name": "tag",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TagHeader_tag"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "About_tag"
          },
          {
            "args": [
              (v5/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "TagArtworks_tag"
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "TagTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Tag",
        "kind": "LinkedField",
        "name": "tag",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": "artworks",
            "args": (v9/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksCounts",
                "kind": "LinkedField",
                "name": "counts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "total",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "kind": "LinkedField",
                "name": "aggregations",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "slice",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
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
                      (v7/*: any*/),
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
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
                                "args": null,
                                "kind": "ScalarField",
                                "name": "aspectRatio",
                                "storageKey": null
                              },
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
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "href",
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
                                "name": "isAuction",
                                "storageKey": null
                              },
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
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v7/*: any*/)
                            ],
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
                                "concreteType": "SaleArtworkCounts",
                                "kind": "LinkedField",
                                "name": "counts",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "bidderPositions",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtworkCurrentBid",
                                "kind": "LinkedField",
                                "name": "currentBid",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "display",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v6/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "artist",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isDefault",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "medium",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v7/*: any*/)
                        ],
                        "type": "Node",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "artworks",
            "args": (v9/*: any*/),
            "filters": [
              "aggregations",
              "input"
            ],
            "handle": "connection",
            "key": "TagArtworksGrid_artworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b3515f0860386634d83c66112c169cad",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "tag": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Tag"
        },
        "tag.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "tag.artworks.__isArtworkConnectionInterface": (v11/*: any*/),
        "tag.artworks.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "tag.artworks.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "tag.artworks.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "tag.artworks.aggregations.counts.name": (v11/*: any*/),
        "tag.artworks.aggregations.counts.value": (v11/*: any*/),
        "tag.artworks.aggregations.slice": {
          "enumValues": [
            "ARTIST",
            "ARTIST_NATIONALITY",
            "ATTRIBUTION_CLASS",
            "COLOR",
            "DIMENSION_RANGE",
            "FOLLOWED_ARTISTS",
            "GALLERY",
            "INSTITUTION",
            "LOCATION_CITY",
            "MAJOR_PERIOD",
            "MATERIALS_TERMS",
            "MEDIUM",
            "MERCHANDISABLE_ARTISTS",
            "PARTNER",
            "PARTNER_CITY",
            "PERIOD",
            "PRICE_RANGE",
            "TOTAL"
          ],
          "nullable": true,
          "plural": false,
          "type": "ArtworkAggregation"
        },
        "tag.artworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "tag.artworks.counts.total": (v12/*: any*/),
        "tag.artworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "tag.artworks.edges.__isNode": (v11/*: any*/),
        "tag.artworks.edges.__typename": (v11/*: any*/),
        "tag.artworks.edges.cursor": (v11/*: any*/),
        "tag.artworks.edges.id": (v13/*: any*/),
        "tag.artworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "tag.artworks.edges.node.__typename": (v11/*: any*/),
        "tag.artworks.edges.node.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "tag.artworks.edges.node.artist.id": (v13/*: any*/),
        "tag.artworks.edges.node.artist.internalID": (v13/*: any*/),
        "tag.artworks.edges.node.artistNames": (v14/*: any*/),
        "tag.artworks.edges.node.date": (v14/*: any*/),
        "tag.artworks.edges.node.href": (v14/*: any*/),
        "tag.artworks.edges.node.id": (v13/*: any*/),
        "tag.artworks.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "tag.artworks.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "tag.artworks.edges.node.image.url": (v14/*: any*/),
        "tag.artworks.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "tag.artworks.edges.node.images.isDefault": (v15/*: any*/),
        "tag.artworks.edges.node.images.url": (v14/*: any*/),
        "tag.artworks.edges.node.internalID": (v13/*: any*/),
        "tag.artworks.edges.node.medium": (v14/*: any*/),
        "tag.artworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "tag.artworks.edges.node.partner.id": (v13/*: any*/),
        "tag.artworks.edges.node.partner.name": (v14/*: any*/),
        "tag.artworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "tag.artworks.edges.node.sale.displayTimelyAt": (v14/*: any*/),
        "tag.artworks.edges.node.sale.endAt": (v14/*: any*/),
        "tag.artworks.edges.node.sale.id": (v13/*: any*/),
        "tag.artworks.edges.node.sale.isAuction": (v15/*: any*/),
        "tag.artworks.edges.node.sale.isClosed": (v15/*: any*/),
        "tag.artworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "tag.artworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "tag.artworks.edges.node.saleArtwork.counts.bidderPositions": (v12/*: any*/),
        "tag.artworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "tag.artworks.edges.node.saleArtwork.currentBid.display": (v14/*: any*/),
        "tag.artworks.edges.node.saleArtwork.id": (v13/*: any*/),
        "tag.artworks.edges.node.saleArtwork.lotLabel": (v14/*: any*/),
        "tag.artworks.edges.node.saleMessage": (v14/*: any*/),
        "tag.artworks.edges.node.slug": (v13/*: any*/),
        "tag.artworks.edges.node.title": (v14/*: any*/),
        "tag.artworks.id": (v13/*: any*/),
        "tag.artworks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "tag.artworks.pageInfo.endCursor": (v14/*: any*/),
        "tag.artworks.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "tag.artworks.pageInfo.startCursor": (v14/*: any*/),
        "tag.description": (v14/*: any*/),
        "tag.id": (v13/*: any*/),
        "tag.internalID": (v13/*: any*/),
        "tag.name": (v14/*: any*/),
        "tag.slug": (v13/*: any*/)
      }
    },
    "name": "TagTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd26a8877ebe6addf125d3eee4084ac06';
export default node;
