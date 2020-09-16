/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistArticles_artwork = {
    readonly artist: {
        readonly articlesConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly href: string | null;
                    readonly thumbnailTitle: string | null;
                    readonly author: {
                        readonly name: string | null;
                    } | null;
                    readonly publishedAt: string | null;
                    readonly thumbnailImage: {
                        readonly resized: {
                            readonly url: string | null;
                        } | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "MyCollectionArtworkArtistArticles_artwork";
};
export type MyCollectionArtworkArtistArticles_artwork$data = MyCollectionArtworkArtistArticles_artwork;
export type MyCollectionArtworkArtistArticles_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistArticles_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistArticles_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistArticles_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
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
                        }
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
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "resized",
                          "storageKey": "resized(width:300)",
                          "args": [
                            {
                              "kind": "Literal",
                              "name": "width",
                              "value": 300
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
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '8a7937f1cbac51df6a53524c34270b81';
export default node;
