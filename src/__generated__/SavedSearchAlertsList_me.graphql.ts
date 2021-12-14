/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchAlertsList_me = {
    readonly " $fragmentRefs": FragmentRefs<"SavedSearchesList_me">;
    readonly " $refType": "SavedSearchAlertsList_me";
};
export type SavedSearchAlertsList_me$data = SavedSearchAlertsList_me;
export type SavedSearchAlertsList_me$key = {
    readonly " $data"?: SavedSearchAlertsList_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"SavedSearchAlertsList_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedSearchAlertsList_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SavedSearchesList_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '09f629a4e6d4b3046d35da21453d9205';
export default node;
