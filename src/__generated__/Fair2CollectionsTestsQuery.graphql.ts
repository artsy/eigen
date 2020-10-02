/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 314bedf405082eb55aedf0e851c527d2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2CollectionsTestsQueryVariables = {
    fairID: string;
};
export type Fair2CollectionsTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2Collections_fair">;
    } | null;
};
export type Fair2CollectionsTestsQueryRawResponse = {
    readonly fair: ({
        readonly marketingCollections: ReadonlyArray<({
            readonly slug: string;
            readonly title: string;
            readonly category: string;
            readonly artworks: ({
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
        }) | null>;
        readonly id: string;
    }) | null;
};
export type Fair2CollectionsTestsQuery = {
    readonly response: Fair2CollectionsTestsQueryResponse;
    readonly variables: Fair2CollectionsTestsQueryVariables;
    readonly rawResponse: Fair2CollectionsTestsQueryRawResponse;
};



/*
query Fair2CollectionsTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair2Collections_fair
    id
  }
}

fragment Fair2Collections_fair on Fair {
  marketingCollections(size: 4) {
    slug
    title
    category
    artworks: artworksConnection(first: 3) {
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
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Fair2CollectionsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Fair2Collections_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Fair2CollectionsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 4
              }
            ],
            "concreteType": "MarketingCollection",
            "kind": "LinkedField",
            "name": "marketingCollections",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
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
                "name": "category",
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
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
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": "artworksConnection(first:3)"
              },
              (v2/*: any*/)
            ],
            "storageKey": "marketingCollections(size:4)"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "314bedf405082eb55aedf0e851c527d2",
    "metadata": {},
    "name": "Fair2CollectionsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '18573dc5cfd5c35b570611189905aa9c';
export default node;
