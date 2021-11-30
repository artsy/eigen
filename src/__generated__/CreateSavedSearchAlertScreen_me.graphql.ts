/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertScreen_me = {
    readonly emailFrequency: string | null;
    readonly " $refType": "CreateSavedSearchAlertScreen_me";
};
export type CreateSavedSearchAlertScreen_me$data = CreateSavedSearchAlertScreen_me;
export type CreateSavedSearchAlertScreen_me$key = {
    readonly " $data"?: CreateSavedSearchAlertScreen_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchAlertScreen_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateSavedSearchAlertScreen_me",
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
(node as any).hash = 'ae0ddf16ad30d3c62fecdb063de9bc62';
export default node;
