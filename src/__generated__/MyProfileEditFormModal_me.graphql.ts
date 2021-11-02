/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditFormModal_me = {
    readonly name: string | null;
    readonly bio: string | null;
    readonly icon: {
        readonly internalID: string | null;
        readonly imageURL: string | null;
    } | null;
    readonly " $refType": "MyProfileEditFormModal_me";
};
export type MyProfileEditFormModal_me$data = MyProfileEditFormModal_me;
export type MyProfileEditFormModal_me$key = {
    readonly " $data"?: MyProfileEditFormModal_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfileEditFormModal_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "icon",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageURL",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '0052937e8c73c5dc9af38d47ae2c192a';
export default node;
