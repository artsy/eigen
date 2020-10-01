/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairBMWArtActivation_fair = {
    readonly slug: string;
    readonly internalID: string;
    readonly sponsoredContent: {
        readonly activationText: string | null;
        readonly pressReleaseUrl: string | null;
    } | null;
    readonly " $refType": "FairBMWArtActivation_fair";
};
export type FairBMWArtActivation_fair$data = FairBMWArtActivation_fair;
export type FairBMWArtActivation_fair$key = {
    readonly " $data"?: FairBMWArtActivation_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairBMWArtActivation_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairBMWArtActivation_fair",
  "selections": [
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
      "concreteType": "FairSponsoredContent",
      "kind": "LinkedField",
      "name": "sponsoredContent",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "activationText",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pressReleaseUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = 'be47ca3ca7dbe8be673f6198196ae359';
export default node;
