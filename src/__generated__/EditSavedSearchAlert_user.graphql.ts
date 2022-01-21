/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditSavedSearchAlert_user = {
    readonly emailFrequency: string | null;
    readonly " $refType": "EditSavedSearchAlert_user";
};
export type EditSavedSearchAlert_user$data = EditSavedSearchAlert_user;
export type EditSavedSearchAlert_user$key = {
    readonly " $data"?: EditSavedSearchAlert_user$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_user">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditSavedSearchAlert_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "emailFrequency",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '11a9b12a83b821f9819a3d182ac81a2c';
export default node;
