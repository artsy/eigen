/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHome_targetSupply = {
    readonly " $fragmentRefs": FragmentRefs<"RecentlySold_targetSupply" | "ArtistList_targetSupply">;
    readonly " $refType": "ConsignmentsHome_targetSupply";
};
export type ConsignmentsHome_targetSupply$data = ConsignmentsHome_targetSupply;
export type ConsignmentsHome_targetSupply$key = {
    readonly " $data"?: ConsignmentsHome_targetSupply$data;
    readonly " $fragmentRefs": FragmentRefs<"ConsignmentsHome_targetSupply">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ConsignmentsHome_targetSupply",
  "type": "TargetSupply",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "RecentlySold_targetSupply",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistList_targetSupply",
      "args": null
    }
  ]
};
(node as any).hash = '34a9087874c46cbd3b5598240383d80f';
export default node;
