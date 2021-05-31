/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticlesRail_articlesConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly id: string;
            readonly " $fragmentRefs": FragmentRefs<"Article_article">;
        } | null;
    } | null> | null;
    readonly " $refType": "ArticlesRail_articlesConnection";
};
export type ArticlesRail_articlesConnection$data = ArticlesRail_articlesConnection;
export type ArticlesRail_articlesConnection$key = {
    readonly " $data"?: ArticlesRail_articlesConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"ArticlesRail_articlesConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArticlesRail_articlesConnection",
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
              "args": null,
              "kind": "FragmentSpread",
              "name": "Article_article"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ArticleConnection",
  "abstractKey": null
};
(node as any).hash = '248abc0ad7707e8173e59c5934f05ea5';
export default node;
