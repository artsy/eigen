/* tslint:disable */
/* eslint-disable */
/* @relayHash 6e3d211b45cf8e314eff21570cb5c2cc */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesHeaderTestsQuery",
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
            "name": "ArtistSeriesHeader_artistSeries",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesHeaderTestsQuery",
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
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesHeaderTestsQuery",
    "id": "2453dc5a4829c2699e9627c3f450faaf",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8195b41790b6eb2e0d25a9d32e318b3f';
export default node;
