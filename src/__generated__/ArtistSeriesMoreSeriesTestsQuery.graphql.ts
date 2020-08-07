/* tslint:disable */
/* eslint-disable */
/* @relayHash 10d3db9d94ad6d812cc817b06e4c3ca2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesMoreSeriesTestsQueryVariables = {};
export type ArtistSeriesMoreSeriesTestsQueryResponse = {
    readonly artistSeries: {
        readonly artist: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMoreSeries_artist">;
        } | null> | null;
    } | null;
};
export type ArtistSeriesMoreSeriesTestsQueryRawResponse = {
    readonly artistSeries: ({
        readonly artist: ReadonlyArray<({
            readonly internalID: string;
            readonly artistSeriesConnection: ({
                readonly totalCount: number;
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly slug: string;
                        readonly internalID: string;
                        readonly title: string;
                        readonly forSaleArtworksCount: number;
                        readonly image: ({
                            readonly url: string | null;
                        }) | null;
                    }) | null;
                }) | null> | null;
            }) | null;
            readonly id: string | null;
        }) | null> | null;
    }) | null;
};
export type ArtistSeriesMoreSeriesTestsQuery = {
    readonly response: ArtistSeriesMoreSeriesTestsQueryResponse;
    readonly variables: ArtistSeriesMoreSeriesTestsQueryVariables;
    readonly rawResponse: ArtistSeriesMoreSeriesTestsQueryRawResponse;
};



/*
query ArtistSeriesMoreSeriesTestsQuery {
  artistSeries(id: "pumpkins") {
    artist: artists(size: 1) {
      ...ArtistSeriesMoreSeries_artist
      id
    }
  }
}

fragment ArtistSeriesMoreSeries_artist on Artist {
  internalID
  artistSeriesConnection(first: 4) {
    totalCount
    edges {
      node {
        slug
        internalID
        title
        forSaleArtworksCount
        image {
          url
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "pumpkins"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "size",
    "value": 1
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artistSeries",
        "storageKey": "artistSeries(id:\"pumpkins\")",
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "artist",
            "name": "artists",
            "storageKey": "artists(size:1)",
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "ArtistSeriesMoreSeries_artist",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artistSeries",
        "storageKey": "artistSeries(id:\"pumpkins\")",
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "artist",
            "name": "artists",
            "storageKey": "artists(size:1)",
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artistSeriesConnection",
                "storageKey": "artistSeriesConnection(first:4)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 4
                  }
                ],
                "concreteType": "ArtistSeriesConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "totalCount",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistSeriesEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ArtistSeries",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "slug",
                            "args": null,
                            "storageKey": null
                          },
                          (v2/*: any*/),
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
                            "name": "forSaleArtworksCount",
                            "args": null,
                            "storageKey": null
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
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "id": "9b9ecfe9d666dd0211606bc3bc63d45d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '5bf5ba76c7fb3490b2d0d102614bc680';
export default node;
