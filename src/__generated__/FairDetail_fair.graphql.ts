/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworksPreview_fair$ref } from "./ArtworksPreview_fair.graphql";
import { FairHeader_fair$ref } from "./FairHeader_fair.graphql";
import { LocationMap_location$ref } from "./LocationMap_location.graphql";
declare const _FairDetail_fair$ref: unique symbol;
export type FairDetail_fair$ref = typeof _FairDetail_fair$ref;
export type FairDetail_fair = {
    readonly id: string;
    readonly hours: string | null;
    readonly location: ({
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly organizer: ({
        readonly profile: ({
            readonly name: string | null;
        }) | null;
    }) | null;
    readonly " $fragmentRefs": FairHeader_fair$ref & ArtworksPreview_fair$ref;
    readonly " $refType": FairDetail_fair$ref;
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
  "name": "FairDetail_fair",
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
      "kind": "FragmentSpread",
      "name": "ArtworksPreview_fair",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "hours",
      "args": null,
      "storageKey": null
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
(node as any).hash = '11a0e180bad404655e657b0bf94c63c5';
export default node;
