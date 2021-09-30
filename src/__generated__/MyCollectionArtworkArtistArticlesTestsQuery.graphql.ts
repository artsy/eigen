/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 124ed00fd7ca13d78edc680f014942ac */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistArticlesTestsQueryVariables = {};
export type MyCollectionArtworkArtistArticlesTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistArticles_artwork">;
    } | null;
};
export type MyCollectionArtworkArtistArticlesTestsQuery = {
    readonly response: MyCollectionArtworkArtistArticlesTestsQueryResponse;
    readonly variables: MyCollectionArtworkArtistArticlesTestsQueryVariables;
};



/*
query MyCollectionArtworkArtistArticlesTestsQuery {
  artwork(id: "some-slug") {
    ...MyCollectionArtworkArtistArticles_artwork
    id
  }
}

fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
  internalID
  slug
  artist {
    slug
    name
    articlesConnection(first: 3, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
      edges {
        node {
          slug
          internalID
          href
          thumbnailTitle
          author {
            name
            id
          }
          publishedAt(format: "MMM Do, YYYY")
          thumbnailImage {
            url
          }
          id
        }
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
    "name": "id",
    "value": "some-slug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistArticles_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  },
                  {
                    "kind": "Literal",
                    "name": "inEditorialFeed",
                    "value": true
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "PUBLISHED_AT_DESC"
                  }
                ],
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
                        "concreteType": "Article",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v1/*: any*/),
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
                            "kind": "ScalarField",
                            "name": "thumbnailTitle",
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
                              (v3/*: any*/),
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "format",
                                "value": "MMM Do, YYYY"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "publishedAt",
                            "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
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
                                "args": null,
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "articlesConnection(first:3,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "124ed00fd7ca13d78edc680f014942ac",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artwork.artist.articlesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArticleConnection"
        },
        "artwork.artist.articlesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArticleEdge"
        },
        "artwork.artist.articlesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Article"
        },
        "artwork.artist.articlesConnection.edges.node.author": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Author"
        },
        "artwork.artist.articlesConnection.edges.node.author.id": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.name": (v6/*: any*/),
        "artwork.artist.articlesConnection.edges.node.href": (v6/*: any*/),
        "artwork.artist.articlesConnection.edges.node.id": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.internalID": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.publishedAt": (v6/*: any*/),
        "artwork.artist.articlesConnection.edges.node.slug": (v6/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artwork.artist.articlesConnection.edges.node.thumbnailImage.url": (v6/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailTitle": (v6/*: any*/),
        "artwork.artist.id": (v5/*: any*/),
        "artwork.artist.name": (v6/*: any*/),
        "artwork.artist.slug": (v5/*: any*/),
        "artwork.id": (v5/*: any*/),
        "artwork.internalID": (v5/*: any*/),
        "artwork.slug": (v5/*: any*/)
      }
    },
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6d7c0fa4882d5b78c9701268a9c74623';
export default node;
