/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2Location_show = {
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly fair: {
        readonly name: string | null;
        readonly location: {
            readonly " $fragmentRefs": FragmentRefs<"LocationMap_location">;
        } | null;
    } | null;
    readonly location: {
        readonly " $fragmentRefs": FragmentRefs<"LocationMap_location">;
    } | null;
    readonly " $refType": "Show2Location_show";
};
export type Show2Location_show$data = Show2Location_show;
export type Show2Location_show$key = {
    readonly " $data"?: Show2Location_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2Location_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
],
v2 = {
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
      "name": "LocationMap_location"
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2Location_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "Partner",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "ExternalPartner",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Fair",
      "kind": "LinkedField",
      "name": "fair",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v2/*: any*/)
      ],
      "storageKey": null
    },
    (v2/*: any*/)
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '1f249522153d810821db063c39ec34bc';
export default node;
