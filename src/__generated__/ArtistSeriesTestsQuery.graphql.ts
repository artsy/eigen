/* tslint:disable */
/* eslint-disable */
/* @relayHash 218756445f0fbc0b8dedfb347b0d1d47 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesTestsQueryVariables = {};
export type ArtistSeriesTestsQueryResponse = {
    readonly artistSeries: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeries_artistSeries">;
    } | null;
};
export type ArtistSeriesTestsQueryRawResponse = {
    readonly artistSeries: ({
        readonly title: string;
        readonly description: string | null;
        readonly artists: ReadonlyArray<({
            readonly id: string;
            readonly internalID: string;
            readonly name: string | null;
            readonly slug: string;
            readonly isFollowed: boolean | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly imageURL: string | null;
        readonly filterArtworksConnection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly title: string | null;
                    readonly imageUrl: string | null;
                    readonly id: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string | null;
        }) | null;
    }) | null;
};
export type ArtistSeriesTestsQuery = {
    readonly response: ArtistSeriesTestsQueryResponse;
    readonly variables: ArtistSeriesTestsQueryVariables;
    readonly rawResponse: ArtistSeriesTestsQueryRawResponse;
};



/*
query ArtistSeriesTestsQuery {
  artistSeries(id: "pumpkins") {
    ...ArtistSeries_artistSeries
  }
}

fragment ArtistSeriesHeader_artistSeries on ArtistSeries {
  imageURL
  filterArtworksConnection(first: 1, sort: "-merchandisability") {
    edges {
      node {
        title
        imageUrl
        id
      }
    }
    id
  }
}

fragment ArtistSeriesMeta_artistSeries on ArtistSeries {
  title
  description
  artists(size: 1) {
    id
    internalID
    name
    slug
    isFollowed
    image {
      url
    }
  }
}

fragment ArtistSeries_artistSeries on ArtistSeries {
  ...ArtistSeriesMeta_artistSeries
  ...ArtistSeriesHeader_artistSeries
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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesTestsQuery",
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
            "kind": "FragmentSpread",
            "name": "ArtistSeries_artistSeries",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesTestsQuery",
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
          (v1/*: any*/),
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
            "name": "artists",
            "storageKey": "artists(size:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 1
              }
            ],
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "internalID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isFollowed",
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
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "imageURL",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(first:1,sort:\"-merchandisability\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-merchandisability"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
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
                      (v1/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "imageUrl",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ]
                  }
                ]
              },
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesTestsQuery",
    "id": "3db326c243a77e56afbde3d197f3a470",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cb9b55b2d2788da2ecffb811cdebd6e3';
export default node;
