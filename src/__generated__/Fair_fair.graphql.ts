/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairDetail_fair$ref } from "./FairDetail_fair.graphql";
declare const _Fair_fair$ref: unique symbol;
export type Fair_fair$ref = typeof _Fair_fair$ref;
export type Fair_fair = {
    readonly gravityID: string;
    readonly id: string;
    readonly organizer: ({
        readonly website: string | null;
    }) | null;
    readonly about: string | null;
    readonly ticketsLink: string | null;
    readonly " $fragmentRefs": FairDetail_fair$ref;
    readonly " $refType": Fair_fair$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Fair_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairDetail_fair",
      "args": null
    },
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
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'fb981a467b3b8c7da3bc732b41742b1d';
export default node;
