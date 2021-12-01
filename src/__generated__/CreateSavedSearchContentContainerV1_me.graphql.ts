/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV1_me = {
    readonly emailFrequency: string | null;
    readonly " $refType": "CreateSavedSearchContentContainerV1_me";
};
export type CreateSavedSearchContentContainerV1_me$data = CreateSavedSearchContentContainerV1_me;
export type CreateSavedSearchContentContainerV1_me$key = {
    readonly " $data"?: CreateSavedSearchContentContainerV1_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV1_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateSavedSearchContentContainerV1_me",
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
(node as any).hash = '0ba53a368516d4237990248e6d34c0be';
export default node;
