/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c6bdf0625589dabe0421e06411cb32bc */

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
        readonly internalID: string;
        readonly slug: string;
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
  internalID
  slug
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
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
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
    "name": "ArtistSeriesMetaTestsQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistSeriesMeta_artistSeries"
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
    "name": "ArtistSeriesMetaTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "kind": "LinkedField",
        "name": "artistSeries",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 1
              }
            ],
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isFollowed",
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
            "storageKey": "artists(size:1)"
          }
        ],
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ]
  },
  "params": {
    "id": "c6bdf0625589dabe0421e06411cb32bc",
    "metadata": {},
    "name": "ArtistSeriesMetaTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '2cf5b0db7dfe478f822b91fb4ee2e201';
export default node;
