/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2453dc5a4829c2699e9627c3f450faaf */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesHeaderTestsQueryVariables = {};
export type ArtistSeriesHeaderTestsQueryResponse = {
    readonly artistSeries: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesHeader_artistSeries">;
    } | null;
};
export type ArtistSeriesHeaderTestsQueryRawResponse = {
    readonly artistSeries: ({
        readonly image: ({
            readonly url: string | null;
        }) | null;
    }) | null;
};
export type ArtistSeriesHeaderTestsQuery = {
    readonly response: ArtistSeriesHeaderTestsQueryResponse;
    readonly variables: ArtistSeriesHeaderTestsQueryVariables;
    readonly rawResponse: ArtistSeriesHeaderTestsQueryRawResponse;
};



/*
query ArtistSeriesHeaderTestsQuery {
  artistSeries(id: "pumpkins") {
    ...ArtistSeriesHeader_artistSeries
  }
}

fragment ArtistSeriesHeader_artistSeries on ArtistSeries {
  image {
    url
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistSeriesHeaderTestsQuery",
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
            "name": "ArtistSeriesHeader_artistSeries"
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
    "name": "ArtistSeriesHeaderTestsQuery",
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
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ]
  },
  "params": {
    "id": "2453dc5a4829c2699e9627c3f450faaf",
    "metadata": {},
    "name": "ArtistSeriesHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '8195b41790b6eb2e0d25a9d32e318b3f';
export default node;
