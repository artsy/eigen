/* tslint:disable */
/* eslint-disable */
/* @relayHash 0072095cb9356caab3b2e313fc8af32a */

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
  artist {
    slug
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
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v4 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v5 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistArticles_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "articlesConnection",
                "storageKey": "articlesConnection(first:3,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")",
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
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArticleEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Article",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "internalID",
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
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "thumbnailTitle",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "author",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Author",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "name",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "publishedAt",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "format",
                                "value": "MMM Do, YYYY"
                              }
                            ],
                            "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "thumbnailImage",
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
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v2/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkArtistArticlesTestsQuery",
    "id": "10474bb4dd0289a459d14d24c9336d6a",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v3/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.slug": (v4/*: any*/),
        "artwork.artist.articlesConnection": {
          "type": "ArticleConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.id": (v3/*: any*/),
        "artwork.artist.articlesConnection.edges": {
          "type": "ArticleEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node": {
          "type": "Article",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node.slug": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.internalID": (v4/*: any*/),
        "artwork.artist.articlesConnection.edges.node.href": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailTitle": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author": {
          "type": "Author",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node.publishedAt": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node.id": (v3/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.name": (v5/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.id": (v3/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage.url": (v5/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '6d7c0fa4882d5b78c9701268a9c74623';
export default node;
