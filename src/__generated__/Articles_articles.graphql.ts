/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Articles_articles = ReadonlyArray<{
        readonly __id: string;
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
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Article_article",
      "args": null
    }
  ],
  "idField": "__id"
};
(node as any).hash = 'da4adfd005ba319a9b348baea0b82933';
export default node;
