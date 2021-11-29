/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ContentRefetchContainer_me = {
    readonly emailFrequency: string | null;
    readonly " $refType": "ContentRefetchContainer_me";
};
export type ContentRefetchContainer_me$data = ContentRefetchContainer_me;
export type ContentRefetchContainer_me$key = {
    readonly " $data"?: ContentRefetchContainer_me$data;
    readonly " $fragmentRefs": FragmentRefs<"ContentRefetchContainer_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ContentRefetchContainer_me",
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
(node as any).hash = 'f132a59cba60eb93d4c181bafa54d0ec';
export default node;
