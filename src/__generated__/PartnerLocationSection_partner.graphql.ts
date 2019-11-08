/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerLocationSection_partner = {
    readonly slug: string;
    readonly name: string | null;
    readonly cities: ReadonlyArray<string | null> | null;
    readonly " $refType": "PartnerLocationSection_partner";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerLocationSection_partner",
  "type": "Partner",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cities",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '8423d19914f10299f0b827d81d4eba62';
export default node;
