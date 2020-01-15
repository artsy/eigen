/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionHeaderTestsQueryVariables = {};
export type CollectionHeaderTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_collection">;
    } | null;
};
export type CollectionHeaderTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly title: string;
        readonly headerImage: string | null;
        readonly descriptionMarkdown: string | null;
        readonly image: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly image: ({
                        readonly resized: ({
                            readonly url: string | null;
                        }) | null;
                    }) | null;
                    readonly id: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type CollectionHeaderTestsQuery = {
    readonly response: CollectionHeaderTestsQueryResponse;
    readonly variables: CollectionHeaderTestsQueryVariables;
    readonly rawResponse: CollectionHeaderTestsQueryRawResponse;
};



/*
query CollectionHeaderTestsQuery {
  marketingCollection(slug: "street-art-now") {
    ...CollectionHeader_collection
    id
  }
}

fragment CollectionHeader_collection on MarketingCollection {
  title
  headerImage
  descriptionMarkdown
  image: artworksConnection(sort: "-decayed_merch", first: 1) {
    edges {
      node {
        image {
          resized(width: 500, height: 204) {
            url
          }
        }
        id
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "street-art-now"
  }
],
v1 = {
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
    "name": "CollectionHeaderTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"street-art-now\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CollectionHeader_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionHeaderTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"street-art-now\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
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
            "name": "headerImage",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "descriptionMarkdown",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "image",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-decayed_merch"
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
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "resized",
                            "storageKey": "resized(height:204,width:500)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "height",
                                "value": 204
                              },
                              {
                                "kind": "Literal",
                                "name": "width",
                                "value": 500
                              }
                            ],
                            "concreteType": "ResizedImageUrl",
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
                      (v1/*: any*/)
                    ]
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionHeaderTestsQuery",
    "id": "2105153f035bc115adc66139d24680d9",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e180021cbf1857303ed41359f9f53b86';
export default node;
