/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Articles_articles = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"ArticleCard_article">;
    readonly " $refType": "Articles_articles";
}>;
export type Articles_articles$data = Articles_articles;
export type Articles_articles$key = ReadonlyArray<{
    readonly " $data"?: Articles_articles$data;
    readonly " $fragmentRefs": FragmentRefs<"Articles_articles">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "Articles_articles",
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
      "name": "ArticleCard_article"
    }
  ],
  "type": "Article",
  "abstractKey": null
};
(node as any).hash = 'bea2241c7d72bc68731af217c056ded4';
export default node;
