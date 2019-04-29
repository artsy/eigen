/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Filters_filteredArtworks$ref } from "./Filters_filteredArtworks.graphql";
export type FiltersTestsQueryVariables = {};
export type FiltersTestsQueryResponse = {
    readonly show: ({
        readonly filteredArtworks: ({
            readonly " $fragmentRefs": Filters_filteredArtworks$ref;
        }) | null;
    }) | null;
};
export type FiltersTestsQuery = {
    readonly response: FiltersTestsQueryResponse;
    readonly variables: FiltersTestsQueryVariables;
};



/*
query FiltersTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    filteredArtworks(size: 0, medium: "*", price_range: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
      ...Filters_filteredArtworks
      __id: id
    }
    __id: id
  }
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      gravityID
      name
      __id: id
    }
  }
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = [
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
    "name": "medium",
    "value": "*",
    "type": "String"
  },
  {
    "kind": "Literal",
    "name": "price_range",
    "value": "*-*",
    "type": "String"
  },
  {
    "kind": "Literal",
    "name": "size",
    "value": 0,
    "type": "Int"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FiltersTestsQuery",
  "id": null,
  "text": "query FiltersTestsQuery {\n  show(id: \"anderson-fine-art-gallery-flickinger-collection\") {\n    filteredArtworks(size: 0, medium: \"*\", price_range: \"*-*\", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {\n      ...Filters_filteredArtworks\n      __id: id\n    }\n    __id: id\n  }\n}\n\nfragment Filters_filteredArtworks on FilterArtworks {\n  aggregations {\n    slice\n    counts {\n      gravityID\n      name\n      __id: id\n    }\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FiltersTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
            "args": v1,
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "Filters_filteredArtworks",
                "args": null
              },
              v2
            ]
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FiltersTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
            "args": v1,
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "gravityID",
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
                      v2
                    ]
                  }
                ]
              },
              v2
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '498c50b425dfc69be09f5ed829194609';
export default node;
