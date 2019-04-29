/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Categories_me$ref } from "./Categories_me.graphql";
export type FavoriteCategoriesQueryVariables = {};
export type FavoriteCategoriesQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": Categories_me$ref;
    }) | null;
};
export type FavoriteCategoriesQuery = {
    readonly response: FavoriteCategoriesQueryResponse;
    readonly variables: FavoriteCategoriesQueryVariables;
};



/*
query FavoriteCategoriesQuery {
  me {
    ...Categories_me
    __id: id
  }
}

fragment Categories_me on Me {
  followed_genes(first: 10) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        gene {
          gravityID
          id
          name
          href
          image {
            url
          }
          __id: id
        }
        __id: id
        __typename
      }
      cursor
    }
  }
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FavoriteCategoriesQuery",
  "id": null,
  "text": "query FavoriteCategoriesQuery {\n  me {\n    ...Categories_me\n    __id: id\n  }\n}\n\nfragment Categories_me on Me {\n  followed_genes(first: 10) {\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      node {\n        gene {\n          gravityID\n          id\n          name\n          href\n          image {\n            url\n          }\n          __id: id\n        }\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteCategoriesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Categories_me",
            "args": null
          },
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteCategoriesQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "followed_genes",
            "storageKey": "followed_genes(first:10)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "concreteType": "FollowGeneConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FollowGeneEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "FollowGene",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "gene",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Gene",
                        "plural": false,
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
                            "name": "id",
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
                            "name": "href",
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
                          },
                          v0
                        ]
                      },
                      v0,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "followed_genes",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "handle": "connection",
            "key": "Categories_followed_genes",
            "filters": null
          },
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'a31860bfc29ee72bfc110b9bb673d455';
export default node;
