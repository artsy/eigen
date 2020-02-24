/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair_fair = {
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"FairDetail_fair">;
    readonly " $refType": "Fair_fair";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair_fair",
  "type": "Fair",
  "metadata": null,
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
      "name": "FairDetail_fair",
      "args": null
    }
  ]
};
(node as any).hash = '76379b672e62b0644edc02b901ea0bee';
export default node;
