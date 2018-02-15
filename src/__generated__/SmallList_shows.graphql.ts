/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SmallList_shows = ReadonlyArray<{
    }>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SmallList_shows",
  "type": "PartnerShow",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Show_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '7fc693edca8ffe74cb41102a5bc9cb22';
export default node;
