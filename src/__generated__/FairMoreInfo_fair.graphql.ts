/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairMoreInfo_fair = {
    readonly organizer: {
        readonly website: string | null;
    } | null;
    readonly slug: string;
    readonly internalID: string;
    readonly about: string | null;
    readonly ticketsLink: string | null;
    readonly " $refType": "FairMoreInfo_fair";
};
export type FairMoreInfo_fair$data = FairMoreInfo_fair;
export type FairMoreInfo_fair$key = {
    readonly " $data"?: FairMoreInfo_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairMoreInfo_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairMoreInfo_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "organizer",
      "kind": "LinkedField",
      "name": "organizer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "website",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
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
      "name": "about",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "ticketsLink",
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '70077522c1800bfee9ee140deea2aabd';
export default node;
