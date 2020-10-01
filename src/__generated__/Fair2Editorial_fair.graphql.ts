/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2Editorial_fair",
  "selections": [
    {
      "alias": "articles",
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
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
                  "name": "href",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "format",
                      "value": "MMM Do, YY"
                    }
                  ],
                  "kind": "ScalarField",
                  "name": "publishedAt",
                  "storageKey": "publishedAt(format:\"MMM Do, YY\")"
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
                      "alias": "src",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "imageURL",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '2870d47f15f61f4916bde70c1a87acaa';
export default node;
