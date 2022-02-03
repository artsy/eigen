/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV2_me = {
    readonly emailFrequency: string | null;
    readonly " $refType": "CreateSavedSearchContentContainerV2_me";
};
export type CreateSavedSearchContentContainerV2_me$data = CreateSavedSearchContentContainerV2_me;
export type CreateSavedSearchContentContainerV2_me$key = {
    readonly " $data"?: CreateSavedSearchContentContainerV2_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateSavedSearchContentContainerV2_me",
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
(node as any).hash = '669be214b68aae550b655eaa858d9e3c';
export default node;
