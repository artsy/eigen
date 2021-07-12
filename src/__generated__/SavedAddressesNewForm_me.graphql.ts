/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedAddressesNewForm_me = {
    readonly id: string;
    readonly phone: string | null;
    readonly " $refType": "SavedAddressesNewForm_me";
};
export type SavedAddressesNewForm_me$data = SavedAddressesNewForm_me;
export type SavedAddressesNewForm_me$key = {
    readonly " $data"?: SavedAddressesNewForm_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SavedAddressesNewForm_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedAddressesNewForm_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phone",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '60aef5dab86f9eecc1779cd4e65e3afc';
export default node;
