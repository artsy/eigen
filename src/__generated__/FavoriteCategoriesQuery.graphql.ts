/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Categories_me$ref } from "./Categories_me.graphql";
export type FavoriteCategoriesQueryVariables = {};
export type FavoriteCategoriesQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": Categories_me$ref;
    } | null;
};
export type FavoriteCategoriesQuery = {
    readonly response: FavoriteCategoriesQueryResponse;
    readonly variables: FavoriteCategoriesQueryVariables;
};



/*
query FavoriteCategoriesQuery {
  me {
    ...Categories_me
    id
  }
}

fragment Categories_me on Me {
  followed_genes: followedGenes(first: 10) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        gene {
          slug
          id
          name
          href
          image {
            url
          }
        }
        id
        __typename
      }
      cursor
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
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
          }
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
            "alias": "followed_genes",
            "name": "followedGenes",
            "storageKey": "followedGenes(first:10)",
            "args": (v0/*: any*/),
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
                            "name": "slug",
                            "args": null,
                            "storageKey": null
                          },
                          (v1/*: any*/),
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
                          }
                        ]
                      },
                      (v1/*: any*/),
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
            "alias": "followed_genes",
            "name": "followedGenes",
            "args": (v0/*: any*/),
            "handle": "connection",
            "key": "Categories_followed_genes",
            "filters": null
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FavoriteCategoriesQuery",
    "id": "d0b07fc1291dc5cef8bcea55c4434c76",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a31860bfc29ee72bfc110b9bb673d455';
export default node;
