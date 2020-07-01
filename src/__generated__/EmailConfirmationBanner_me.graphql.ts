/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EmailConfirmationBanner_me = {
    readonly canRequestEmailConfirmation: boolean;
    readonly " $refType": "EmailConfirmationBanner_me";
};
export type EmailConfirmationBanner_me$data = EmailConfirmationBanner_me;
export type EmailConfirmationBanner_me$key = {
    readonly " $data"?: EmailConfirmationBanner_me$data;
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "EmailConfirmationBanner_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "canRequestEmailConfirmation",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'df80077c68634386023a2e3c2a883af4';
export default node;
