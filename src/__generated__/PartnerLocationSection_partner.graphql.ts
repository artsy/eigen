/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerLocationSection_partner = {
    readonly name: string | null;
    readonly locations: ReadonlyArray<{
        readonly city: string | null;
    } | null> | null;
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "locations",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "city",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '225249a639c53ae15b55a059cfac5a61';
export default node;
