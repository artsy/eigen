/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairHeader_fair$ref } from "./FairHeader_fair.graphql";
import { LocationMap_location$ref } from "./LocationMap_location.graphql";
declare const _Fair_fair$ref: unique symbol;
export type Fair_fair$ref = typeof _Fair_fair$ref;
export type Fair_fair = {
    readonly location: ({
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly organizer: ({
        readonly profile: ({
            readonly name: string | null;
        }) | null;
    }) | null;
    readonly " $fragmentRefs": FairHeader_fair$ref;
    readonly " $refType": Fair_fair$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Fair_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "FairHeader_fair",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        },
        v0
      ]
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
          "kind": "LinkedField",
          "alias": null,
          "name": "profile",
          "storageKey": null,
          "args": null,
          "concreteType": "Profile",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "name",
              "args": null,
              "storageKey": null
            },
            v0
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = 'f0b8b23018e349d3dcff17edf15d1c96';
export default node;
