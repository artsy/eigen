/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2Hours_show = {
    readonly id: string;
    readonly location: {
        readonly " $fragmentRefs": FragmentRefs<"Show2LocationHours_location">;
    } | null;
    readonly fair: {
        readonly location: {
            readonly " $fragmentRefs": FragmentRefs<"Show2LocationHours_location">;
        } | null;
    } | null;
    readonly " $refType": "Show2Hours_show";
};
export type Show2Hours_show$data = Show2Hours_show;
export type Show2Hours_show$key = {
    readonly " $data"?: Show2Hours_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2Hours_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2LocationHours_location"
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2Hours_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Fair",
      "kind": "LinkedField",
      "name": "fair",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '1deb83849ca6854c308f9be40986fa2d';
export default node;
