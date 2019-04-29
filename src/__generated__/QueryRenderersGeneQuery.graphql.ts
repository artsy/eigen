/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Gene_gene$ref } from "./Gene_gene.graphql";
export type QueryRenderersGeneQueryVariables = {
    readonly geneID: string;
    readonly medium?: string | null;
    readonly price_range?: string | null;
};
export type QueryRenderersGeneQueryResponse = {
    readonly gene: ({
        readonly " $fragmentRefs": Gene_gene$ref;
    }) | null;
};
export type QueryRenderersGeneQuery = {
    readonly response: QueryRenderersGeneQueryResponse;
    readonly variables: QueryRenderersGeneQueryVariables;
};



/*
query QueryRenderersGeneQuery(
  $geneID: String!
  $medium: String
  $price_range: String
) {
  gene(id: $geneID) {
    ...Gene_gene_2UkO81
    __id: id
  }
}

fragment Gene_gene_2UkO81 on Gene {
  ...Header_gene
  ...About_gene
  filtered_artworks(size: 0, medium: $medium, price_range: $price_range, sort: "-partner_updated_at", aggregations: [MEDIUM, PRICE_RANGE, TOTAL], for_sale: true) {
    total
    aggregations {
      slice
      counts {
        gravityID
        name
        count
        __id: id
      }
    }
    ...GeneArtworksGrid_filtered_artworks_32r0OK
    __id: id
  }
  __id: id
}

fragment Header_gene on Gene {
  internalID
  gravityID
  name
  __id: id
}

fragment About_gene on Gene {
  ...Biography_gene
  trending_artists {
    ...RelatedArtists_artists
    __id: id
  }
  __id: id
}

fragment GeneArtworksGrid_filtered_artworks_32r0OK on FilterArtworks {
  id
  artworks: artworks_connection(first: 10, after: "", sort: "-partner_updated_at") {
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

fragment Biography_gene on Gene {
  description
  __id: id
}

fragment RelatedArtists_artists on Artist {
  id
  ...RelatedArtist_artist
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
    "name": "geneID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "medium",
    "type": "String",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "price_range",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "geneID",
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
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
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
v8 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-partner_updated_at",
  "type": "String"
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v10 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v11 = [
  v4,
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersGeneQuery",
  "id": null,
  "text": "query QueryRenderersGeneQuery(\n  $geneID: String!\n  $medium: String\n  $price_range: String\n) {\n  gene(id: $geneID) {\n    ...Gene_gene_2UkO81\n    __id: id\n  }\n}\n\nfragment Gene_gene_2UkO81 on Gene {\n  ...Header_gene\n  ...About_gene\n  filtered_artworks(size: 0, medium: $medium, price_range: $price_range, sort: \"-partner_updated_at\", aggregations: [MEDIUM, PRICE_RANGE, TOTAL], for_sale: true) {\n    total\n    aggregations {\n      slice\n      counts {\n        gravityID\n        name\n        count\n        __id: id\n      }\n    }\n    ...GeneArtworksGrid_filtered_artworks_32r0OK\n    __id: id\n  }\n  __id: id\n}\n\nfragment Header_gene on Gene {\n  internalID\n  gravityID\n  name\n  __id: id\n}\n\nfragment About_gene on Gene {\n  ...Biography_gene\n  trending_artists {\n    ...RelatedArtists_artists\n    __id: id\n  }\n  __id: id\n}\n\nfragment GeneArtworksGrid_filtered_artworks_32r0OK on FilterArtworks {\n  id\n  artworks: artworks_connection(first: 10, after: \"\", sort: \"-partner_updated_at\") {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        gravityID\n        id\n        image {\n          aspect_ratio\n        }\n        ...Artwork_artwork\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n\nfragment Biography_gene on Gene {\n  description\n  __id: id\n}\n\nfragment RelatedArtists_artists on Artist {\n  id\n  ...RelatedArtist_artist\n  __id: id\n}\n\nfragment RelatedArtist_artist on Artist {\n  href\n  name\n  counts {\n    for_sale_artworks\n    artworks\n  }\n  image {\n    url(version: \"large\")\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersGeneQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gene",
        "storageKey": null,
        "args": v1,
        "concreteType": "Gene",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Gene_gene",
            "args": [
              {
                "kind": "Variable",
                "name": "medium",
                "variableName": "medium",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "price_range",
                "variableName": "price_range",
                "type": null
              }
            ]
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersGeneQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gene",
        "storageKey": null,
        "args": v1,
        "concreteType": "Gene",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          v3,
          v4,
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "trending_artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              v5,
              v6,
              v4,
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
                    "name": "for_sale_artworks",
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
                "selections": [
                  v7
                ]
              },
              v2
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filtered_artworks",
            "storageKey": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MEDIUM",
                  "PRICE_RANGE",
                  "TOTAL"
                ],
                "type": "[ArtworkAggregation]"
              },
              {
                "kind": "Literal",
                "name": "for_sale",
                "value": true,
                "type": "Boolean"
              },
              {
                "kind": "Variable",
                "name": "medium",
                "variableName": "medium",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "price_range",
                "variableName": "price_range",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0,
                "type": "Int"
              },
              v8
            ],
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "total",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "aggregations",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slice",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "counts",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "plural": true,
                    "selections": [
                      v3,
                      v4,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "count",
                        "args": null,
                        "storageKey": null
                      },
                      v2
                    ]
                  }
                ]
              },
              v5,
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworks_connection",
                "storageKey": "artworks_connection(after:\"\",first:10,sort:\"-partner_updated_at\")",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "after",
                    "value": "",
                    "type": "String"
                  },
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  },
                  v8
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": [
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
                          v3,
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
                              v7
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
                          v5,
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
                              v9,
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
                                "selections": v10
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "current_bid",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "SaleArtworkCurrentBid",
                                "plural": false,
                                "selections": v10
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
                                  v9,
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
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": v11
                          },
                          v6,
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
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artworks",
                "name": "artworks_connection",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "after",
                    "value": "",
                    "type": "String"
                  },
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  },
                  v8
                ],
                "handle": "connection",
                "key": "GeneArtworksGrid_artworks",
                "filters": [
                  "sort"
                ]
              },
              v2
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '737eab50164daed47fbc03498ad91fd5';
export default node;
