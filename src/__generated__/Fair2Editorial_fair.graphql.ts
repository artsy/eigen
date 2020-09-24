/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Editorial_fair = {
    readonly articles: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly title: string | null;
                readonly href: string | null;
                readonly publishedAt: string | null;
                readonly thumbnailImage: {
                    readonly src: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Fair2Editorial_fair";
};
export type Fair2Editorial_fair$data = Fair2Editorial_fair;
export type Fair2Editorial_fair$key = {
    readonly " $data"?: Fair2Editorial_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Editorial_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2Editorial_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "articles",
      "name": "articlesConnection",
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
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
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
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
                  "name": "href",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "publishedAt",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "format",
                      "value": "MMM Do, YY"
                    }
                  ],
                  "storageKey": "publishedAt(format:\"MMM Do, YY\")"
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
                      "alias": "src",
                      "name": "imageURL",
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
};
(node as any).hash = '2870d47f15f61f4916bde70c1a87acaa';
export default node;
