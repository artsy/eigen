/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type VariableSizeShowsList_shows = ReadonlyArray<{
        readonly __id: string;
    }>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "VariableSizeShowsList_shows",
  "type": "PartnerShow",
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
      "name": "Show_show",
      "args": null
    }
  ],
  "idField": "__id"
};
(node as any).hash = 'c98a9cbf3a7a99969a7d290dc1691c05';
export default node;
