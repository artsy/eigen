/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchAlertsList_me = {
    readonly " $fragmentRefs": FragmentRefs<"SavedSearches_me">;
    readonly " $refType": "SavedSearchAlertsList_me";
};
export type SavedSearchAlertsList_me$data = SavedSearchAlertsList_me;
export type SavedSearchAlertsList_me$key = {
    readonly " $data"?: SavedSearchAlertsList_me$data;
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
      "name": "SavedSearches_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'bb4dab0082f6a02354c5f433c41bfb41';
export default node;
