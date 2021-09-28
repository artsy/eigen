/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ec0d61afcb64cd0a545a1aa426b952a9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticleSorts = "PUBLISHED_AT_ASC" | "PUBLISHED_AT_DESC" | "%future added value";
export type ArtistArticlesQueryVariables = {
    id: string;
    count?: number | null;
    after?: string | null;
    sort?: ArticleSorts | null;
    inEditorialFeed?: boolean | null;
};
export type ArtistArticlesQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistArticles_articlesConnection">;
    } | null;
};
export type ArtistArticlesQuery = {
    readonly response: ArtistArticlesQueryResponse;
    readonly variables: ArtistArticlesQueryVariables;
};



/*
query ArtistArticlesQuery(
  $id: String!
  $count: Int
  $after: String
  $sort: ArticleSorts
  $inEditorialFeed: Boolean
) {
  artist(id: $id) @principalField {
    ...ArtistArticles_articlesConnection_44T6UW
    id
  }
}

fragment ArticleCard_article on Article {
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
}

fragment ArtistArticles_articlesConnection_44T6UW on Artist {
  articlesConnection(first: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed) {
    edges {
      cursor
      node {
        internalID
        slug
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
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inEditorialFeed"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v5 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v6 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v7 = {
  "kind": "Variable",
  "name": "inEditorialFeed",
  "variableName": "inEditorialFeed"
},
v8 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v9 = [
  (v6/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
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
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArticlesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": [
              (v6/*: any*/),
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "ArtistArticles_articlesConnection"
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistArticlesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v9/*: any*/),
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
                          (v10/*: any*/)
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
                      (v10/*: any*/),
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
            "args": (v9/*: any*/),
            "filters": [
              "sort",
              "inEditorialFeed"
            ],
            "handle": "connection",
            "key": "ArtistArticles_articlesConnection",
            "kind": "LinkedHandle",
            "name": "articlesConnection"
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ec0d61afcb64cd0a545a1aa426b952a9",
    "metadata": {},
    "name": "ArtistArticlesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '4d6fe0520de90900cf23ddb2246d9c7e';
export default node;
