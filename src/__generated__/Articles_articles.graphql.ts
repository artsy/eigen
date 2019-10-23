/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Articles_articles = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"Article_article">;
    readonly " $refType": "Articles_articles";
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
      "name": "id",
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
(node as any).hash = '48bbee277fbab78d7648e775633f67ad';
export default node;
