/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairMoreInfo_fair$ref: unique symbol;
export type FairMoreInfo_fair$ref = typeof _FairMoreInfo_fair$ref;
export type FairMoreInfo_fair = {
    readonly organizer: {
        readonly website: string | null;
    } | null;
    readonly slug: string;
    readonly internalID: string;
    readonly about: string | null;
    readonly ticketsLink: string | null;
    readonly " $refType": FairMoreInfo_fair$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairMoreInfo_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "organizer",
      "storageKey": null,
      "args": null,
      "concreteType": "organizer",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "website",
          "args": null,
          "storageKey": null
        }
      ]
    },
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "about",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ticketsLink",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '70077522c1800bfee9ee140deea2aabd';
export default node;
