/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d8d87f134f026e2877fdd9d2ed76c47b */

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
            readonly slug: string;
            readonly artistSeriesConnection: ({
                readonly totalCount: number;
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly slug: string;
                        readonly internalID: string;
                        readonly title: string;
                        readonly featured: boolean;
                        readonly artworksCountMessage: string | null;
                        readonly image: ({
                            readonly url: string | null;
                        }) | null;
                    }) | null;
                }) | null> | null;
            }) | null;
            readonly id: string;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "kind": "LinkedField",
        "name": "artistSeries",
        "plural": false,
        "selections": [
          {
            "alias": "artist",
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ArtistSeriesMoreSeries_artist"
              }
            ],
            "storageKey": "artists(size:1)"
          }
        ],
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "kind": "LinkedField",
        "name": "artistSeries",
        "plural": false,
        "selections": [
          {
            "alias": "artist",
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
                                "name": "url",
                                "storageKey": null
                              }
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
                "storageKey": "artistSeriesConnection(first:4)"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "artists(size:1)"
          }
        ],
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ]
  },
  "params": {
    "id": "d8d87f134f026e2877fdd9d2ed76c47b",
    "metadata": {},
    "name": "ArtistSeriesMoreSeriesTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5bf5ba76c7fb3490b2d0d102614bc680';
export default node;
