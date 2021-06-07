/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f02e38b385caf5ba12c5ebd121359863 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticleSorts = "PUBLISHED_AT_ASC" | "PUBLISHED_AT_DESC" | "%future added value";
export type ArticlesQueryVariables = {
    count?: number | null;
    after?: string | null;
    sort?: ArticleSorts | null;
    inEditorialFeed?: boolean | null;
};
export type ArticlesQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"Articles_articlesConnection">;
};
export type ArticlesQuery = {
    readonly response: ArticlesQueryResponse;
    readonly variables: ArticlesQueryVariables;
};



/*
query ArticlesQuery(
  $count: Int
  $after: String
  $sort: ArticleSorts
  $inEditorialFeed: Boolean
) {
  ...Articles_articlesConnection_44T6UW
}

fragment ArticleCard_article on Article {
  internalID
  author {
    name
    id
  }
  href
  thumbnailImage {
    url(version: "large")
  }
  thumbnailTitle
  vertical
}

fragment Articles_articlesConnection_44T6UW on Query {
  articlesConnection(first: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed) {
    edges {
      cursor
      node {
        internalID
        slug
        author {
          name
          id
        }
        href
        thumbnailImage {
          url(version: "large")
        }
        thumbnailTitle
        vertical
        ...ArticleCard_article
        id
        __typename
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inEditorialFeed"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v4 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v5 = {
  "kind": "Variable",
  "name": "inEditorialFeed",
  "variableName": "inEditorialFeed"
},
v6 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v7 = [
  (v4/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v5/*: any*/),
  (v6/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArticlesQuery",
    "selections": [
      {
        "args": [
          (v4/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "Articles_articlesConnection"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArticlesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "ArticleConnection",
        "kind": "LinkedField",
        "name": "articlesConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArticleEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Article",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "internalID",
                    "storageKey": null
                  },
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
                    "concreteType": "Author",
                    "kind": "LinkedField",
                    "name": "author",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "href",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "thumbnailImage",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "large"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": "url(version:\"large\")"
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "thumbnailTitle",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "vertical",
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "filters": [
          "sort",
          "inEditorialFeed"
        ],
        "handle": "connection",
        "key": "Articles_articlesConnection",
        "kind": "LinkedHandle",
        "name": "articlesConnection"
      }
    ]
  },
  "params": {
    "id": "f02e38b385caf5ba12c5ebd121359863",
    "metadata": {},
    "name": "ArticlesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5713c913d49d6a217436a4f84cf342eb';
export default node;
