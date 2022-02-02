/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash bfebbab20d5392aa0ca5d9d075ea0309 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "ARTIST_NATIONALITY" | "ATTRIBUTION_CLASS" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "LOCATION_CITY" | "MAJOR_PERIOD" | "MATERIALS_TERMS" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type ArtworkSizes = "LARGE" | "MEDIUM" | "SMALL" | "%future added value";
export type FilterArtworksInput = {
    acquireable?: boolean | null | undefined;
    additionalGeneIDs?: Array<string | null> | null | undefined;
    after?: string | null | undefined;
    aggregationPartnerCities?: Array<string | null> | null | undefined;
    aggregations?: Array<ArtworkAggregation | null> | null | undefined;
    artistID?: string | null | undefined;
    artistIDs?: Array<string | null> | null | undefined;
    artistNationalities?: Array<string | null> | null | undefined;
    artistSeriesID?: string | null | undefined;
    atAuction?: boolean | null | undefined;
    attributionClass?: Array<string | null> | null | undefined;
    before?: string | null | undefined;
    color?: string | null | undefined;
    colors?: Array<string | null> | null | undefined;
    dimensionRange?: string | null | undefined;
    excludeArtworkIDs?: Array<string | null> | null | undefined;
    extraAggregationGeneIDs?: Array<string | null> | null | undefined;
    first?: number | null | undefined;
    forSale?: boolean | null | undefined;
    geneID?: string | null | undefined;
    geneIDs?: Array<string | null> | null | undefined;
    height?: string | null | undefined;
    includeArtworksByFollowedArtists?: boolean | null | undefined;
    includeMediumFilterInAggregation?: boolean | null | undefined;
    inquireableOnly?: boolean | null | undefined;
    keyword?: string | null | undefined;
    keywordMatchExact?: boolean | null | undefined;
    last?: number | null | undefined;
    locationCities?: Array<string | null> | null | undefined;
    majorPeriods?: Array<string | null> | null | undefined;
    marketable?: boolean | null | undefined;
    materialsTerms?: Array<string | null> | null | undefined;
    medium?: string | null | undefined;
    offerable?: boolean | null | undefined;
    page?: number | null | undefined;
    partnerCities?: Array<string | null> | null | undefined;
    partnerID?: string | null | undefined;
    partnerIDs?: Array<string | null> | null | undefined;
    period?: string | null | undefined;
    periods?: Array<string | null> | null | undefined;
    priceRange?: string | null | undefined;
    saleID?: string | null | undefined;
    size?: number | null | undefined;
    sizes?: Array<ArtworkSizes | null> | null | undefined;
    sort?: string | null | undefined;
    tagID?: string | null | undefined;
    width?: string | null | undefined;
};
export type GeneTestsQueryVariables = {
    geneID: string;
    input?: FilterArtworksInput | null | undefined;
};
export type GeneTestsQueryResponse = {
    readonly gene: {
        readonly slug: string;
        readonly " $fragmentRefs": FragmentRefs<"Header_gene" | "About_gene" | "GeneArtworks_gene">;
    } | null;
};
export type GeneTestsQuery = {
    readonly response: GeneTestsQueryResponse;
    readonly variables: GeneTestsQueryVariables;
};



/*
query GeneTestsQuery(
  $geneID: String!
  $input: FilterArtworksInput
) {
  gene(id: $geneID) {
    slug
    ...Header_gene
    ...About_gene
    ...GeneArtworks_gene_2VV6jB
    id
  }
}

fragment About_gene on Gene {
  ...Biography_gene
  trending_artists: trendingArtists {
    ...RelatedArtists_artists
    id
  }
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
  realizedPrice
}

fragment Biography_gene on Gene {
  description
}

fragment GeneArtworks_gene_2VV6jB on Gene {
  id
  internalID
  slug
  artworks: filterArtworksConnection(first: 10, after: "", aggregations: [LOCATION_CITY, ARTIST_NATIONALITY, PRICE_RANGE, COLOR, DIMENSION_RANGE, PARTNER, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, ARTIST, LOCATION_CITY, MATERIALS_TERMS], forSale: true, input: $input) {
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

fragment Header_gene on Gene {
  internalID
  slug
  id
  isFollowed
  name
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
    }
    ... on Node {
      __isNode: __typename
      id
    }
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
    "name": "geneID"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "geneID"
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
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
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
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
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
  {
    "kind": "Literal",
    "name": "forSale",
    "value": true
  },
  (v3/*: any*/)
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
  "type": "Image"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GeneTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Gene",
        "kind": "LinkedField",
        "name": "gene",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Header_gene"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "About_gene"
          },
          {
            "args": [
              (v3/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "GeneArtworks_gene"
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
    "name": "GeneTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Gene",
        "kind": "LinkedField",
        "name": "gene",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          },
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": "trending_artists",
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "trendingArtists",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v7/*: any*/),
              (v6/*: any*/),
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
                "selections": [
                  (v8/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
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
                      (v5/*: any*/),
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
              (v5/*: any*/),
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
                          (v2/*: any*/),
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
                              (v8/*: any*/)
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
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          (v7/*: any*/),
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
                              (v5/*: any*/)
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
                              (v5/*: any*/)
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
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "realizedPrice",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
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
              "forSale",
              "input"
            ],
            "handle": "connection",
            "key": "GeneArtworksGrid_artworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "bfebbab20d5392aa0ca5d9d075ea0309",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "gene": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Gene"
        },
        "gene.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "gene.artworks.__isArtworkConnectionInterface": (v11/*: any*/),
        "gene.artworks.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "gene.artworks.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "gene.artworks.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "gene.artworks.aggregations.counts.name": (v11/*: any*/),
        "gene.artworks.aggregations.counts.value": (v11/*: any*/),
        "gene.artworks.aggregations.slice": {
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
        "gene.artworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "gene.artworks.counts.total": (v12/*: any*/),
        "gene.artworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "gene.artworks.edges.__isNode": (v11/*: any*/),
        "gene.artworks.edges.__typename": (v11/*: any*/),
        "gene.artworks.edges.cursor": (v11/*: any*/),
        "gene.artworks.edges.id": (v13/*: any*/),
        "gene.artworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "gene.artworks.edges.node.__typename": (v11/*: any*/),
        "gene.artworks.edges.node.artistNames": (v14/*: any*/),
        "gene.artworks.edges.node.date": (v14/*: any*/),
        "gene.artworks.edges.node.href": (v14/*: any*/),
        "gene.artworks.edges.node.id": (v13/*: any*/),
        "gene.artworks.edges.node.image": (v15/*: any*/),
        "gene.artworks.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "gene.artworks.edges.node.image.url": (v14/*: any*/),
        "gene.artworks.edges.node.internalID": (v13/*: any*/),
        "gene.artworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "gene.artworks.edges.node.partner.id": (v13/*: any*/),
        "gene.artworks.edges.node.partner.name": (v14/*: any*/),
        "gene.artworks.edges.node.realizedPrice": (v14/*: any*/),
        "gene.artworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "gene.artworks.edges.node.sale.displayTimelyAt": (v14/*: any*/),
        "gene.artworks.edges.node.sale.endAt": (v14/*: any*/),
        "gene.artworks.edges.node.sale.id": (v13/*: any*/),
        "gene.artworks.edges.node.sale.isAuction": (v16/*: any*/),
        "gene.artworks.edges.node.sale.isClosed": (v16/*: any*/),
        "gene.artworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "gene.artworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "gene.artworks.edges.node.saleArtwork.counts.bidderPositions": (v12/*: any*/),
        "gene.artworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "gene.artworks.edges.node.saleArtwork.currentBid.display": (v14/*: any*/),
        "gene.artworks.edges.node.saleArtwork.id": (v13/*: any*/),
        "gene.artworks.edges.node.saleArtwork.lotLabel": (v14/*: any*/),
        "gene.artworks.edges.node.saleMessage": (v14/*: any*/),
        "gene.artworks.edges.node.slug": (v13/*: any*/),
        "gene.artworks.edges.node.title": (v14/*: any*/),
        "gene.artworks.id": (v13/*: any*/),
        "gene.artworks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "gene.artworks.pageInfo.endCursor": (v14/*: any*/),
        "gene.artworks.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "gene.artworks.pageInfo.startCursor": (v14/*: any*/),
        "gene.description": (v14/*: any*/),
        "gene.id": (v13/*: any*/),
        "gene.internalID": (v13/*: any*/),
        "gene.isFollowed": (v16/*: any*/),
        "gene.name": (v14/*: any*/),
        "gene.slug": (v13/*: any*/),
        "gene.trending_artists": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Artist"
        },
        "gene.trending_artists.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistCounts"
        },
        "gene.trending_artists.counts.artworks": (v12/*: any*/),
        "gene.trending_artists.counts.forSaleArtworks": (v12/*: any*/),
        "gene.trending_artists.href": (v14/*: any*/),
        "gene.trending_artists.id": (v13/*: any*/),
        "gene.trending_artists.image": (v15/*: any*/),
        "gene.trending_artists.image.url": (v14/*: any*/),
        "gene.trending_artists.name": (v14/*: any*/)
      }
    },
    "name": "GeneTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ea368f1f79a32f141dc6892f2a6250d3';
export default node;
