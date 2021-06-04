/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticlesRail_articlesConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly internalID: string;
            readonly slug: string | null;
            readonly " $fragmentRefs": FragmentRefs<"ArticleCard_article">;
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
              "args": null,
              "kind": "FragmentSpread",
              "name": "ArticleCard_article"
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
(node as any).hash = 'd1faa0a4c1bf19ce469a9c78f1c5308f';
export default node;
