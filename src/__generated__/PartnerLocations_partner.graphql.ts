/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerLocations_partner = {
    readonly name: string | null;
    readonly locations: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"PartnerMap_location">;
    } | null> | null;
    readonly " $refType": "PartnerLocations_partner";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerLocations_partner",
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
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "PartnerMap_location",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '76b746517c6bf86690fa996d09e2731b';
export default node;
