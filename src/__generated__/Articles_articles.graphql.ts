/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Article_article$ref } from "./Article_article.graphql";
declare const _Articles_articles$ref: unique symbol;
export type Articles_articles$ref = typeof _Articles_articles$ref;
export type Articles_articles = ReadonlyArray<{
    readonly __id: string;
    readonly " $fragmentRefs": Article_article$ref;
    readonly " $refType": Articles_articles$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Articles_articles",
  "type": "Article",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Article_article",
      "args": null
    }
  ]
};
(node as any).hash = 'da4adfd005ba319a9b348baea0b82933';
export default node;
