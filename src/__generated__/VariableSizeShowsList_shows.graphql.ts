/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Show_show$ref } from "./Show_show.graphql";
declare const _VariableSizeShowsList_shows$ref: unique symbol;
export type VariableSizeShowsList_shows$ref = typeof _VariableSizeShowsList_shows$ref;
export type VariableSizeShowsList_shows = ReadonlyArray<{
    readonly __id: string;
    readonly " $fragmentRefs": Show_show$ref;
    readonly " $refType": VariableSizeShowsList_shows$ref;
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
  ]
};
(node as any).hash = 'c98a9cbf3a7a99969a7d290dc1691c05';
export default node;
