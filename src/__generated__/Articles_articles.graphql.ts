/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Article_article$ref } from "./Article_article.graphql";
declare const _Articles_articles$ref: unique symbol;
export type Articles_articles$ref = typeof _Articles_articles$ref;
export type Articles_articles = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": Article_article$ref;
    readonly " $refType": Articles_articles$ref;
}>;



const node: ConcreteFragment = {
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
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Article_article",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '48bbee277fbab78d7648e775633f67ad';
export default node;
