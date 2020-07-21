/* tslint:disable */
/* eslint-disable */
/* @relayHash e0a5259ac54b7ff145dfb81f23ce138f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesMetaTestsQueryVariables = {};
export type ArtistSeriesMetaTestsQueryResponse = {
    readonly artistSeries: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMeta_artistSeries">;
    } | null;
};
export type ArtistSeriesMetaTestsQueryRawResponse = {
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
    }) | null;
};
export type ArtistSeriesMetaTestsQuery = {
    readonly response: ArtistSeriesMetaTestsQueryResponse;
    readonly variables: ArtistSeriesMetaTestsQueryVariables;
    readonly rawResponse: ArtistSeriesMetaTestsQueryRawResponse;
};



/*
query ArtistSeriesMetaTestsQuery {
  artistSeries(id: "pumpkins") {
    ...ArtistSeriesMeta_artistSeries
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "pumpkins"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesMetaTestsQuery",
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
            "name": "ArtistSeriesMeta_artistSeries",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesMetaTestsQuery",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesMetaTestsQuery",
    "id": "96297eb198ba2a98c38275bd3e1ebce1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2cf5b0db7dfe478f822b91fb4ee2e201';
export default node;
