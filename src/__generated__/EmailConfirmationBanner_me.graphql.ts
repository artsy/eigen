/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmailConfirmationBanner_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "canRequestEmailConfirmation",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'df80077c68634386023a2e3c2a883af4';
export default node;
