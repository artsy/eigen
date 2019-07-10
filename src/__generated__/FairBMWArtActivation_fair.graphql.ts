/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairBMWArtActivation_fair$ref: unique symbol;
export type FairBMWArtActivation_fair$ref = typeof _FairBMWArtActivation_fair$ref;
export type FairBMWArtActivation_fair = {
    readonly gravityID: string;
    readonly internalID: string;
    readonly sponsoredContent: {
        readonly activationText: string | null;
        readonly pressReleaseUrl: string | null;
    } | null;
    readonly " $refType": FairBMWArtActivation_fair$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairBMWArtActivation_fair",
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sponsoredContent",
      "storageKey": null,
      "args": null,
      "concreteType": "FairSponsoredContent",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "activationText",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "pressReleaseUrl",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '2026a38b644dea99eba8dcafe53a7a47';
export default node;
