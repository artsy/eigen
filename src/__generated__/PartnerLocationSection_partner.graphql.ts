/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerLocationSection_partner = {
    readonly slug: string;
    readonly name: string | null;
    readonly cities: ReadonlyArray<string | null> | null;
    readonly locations: {
        readonly totalCount: number | null;
    } | null;
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
    },
    {
      "kind": "LinkedField",
      "alias": "locations",
      "name": "locationsConnection",
      "storageKey": "locationsConnection(first:0)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 0
        }
      ],
      "concreteType": "LocationConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "totalCount",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '432784fab5ee05283a2555d2b160dff6';
export default node;
