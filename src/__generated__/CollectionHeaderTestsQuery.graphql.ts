/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b167d55e9973d983c1dabae6bfee28ca */

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
                        readonly url: string | null;
                    }) | null;
                    readonly id: string;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly id: string;
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
          url(version: "larger")
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CollectionHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CollectionHeader_collection"
          }
        ],
        "storageKey": "marketingCollection(slug:\"street-art-now\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CollectionHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
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
            "name": "headerImage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "descriptionMarkdown",
            "storageKey": null
          },
          {
            "alias": "image",
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
            "kind": "LinkedField",
            "name": "artworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
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
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "larger"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"larger\")"
                          }
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")"
          },
          (v1/*: any*/)
        ],
        "storageKey": "marketingCollection(slug:\"street-art-now\")"
      }
    ]
  },
  "params": {
    "id": "b167d55e9973d983c1dabae6bfee28ca",
    "metadata": {},
    "name": "CollectionHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e180021cbf1857303ed41359f9f53b86';
export default node;
