/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PhoneNumberErrors = "INVALID_COUNTRY_CODE" | "INVALID_NUMBER" | "TOO_LONG" | "TOO_SHORT" | "%future added value";
export type ContactInformation_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly phone: string | null;
    readonly phoneNumber: {
        readonly countryCode: string | null;
        readonly display: string | null;
        readonly error: PhoneNumberErrors | null;
        readonly isValid: boolean | null;
        readonly originalNumber: string | null;
        readonly regionCode: string | null;
    } | null;
    readonly " $refType": "ContactInformation_me";
};
export type ContactInformation_me$data = ContactInformation_me;
export type ContactInformation_me$key = {
    readonly " $data"?: ContactInformation_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ContactInformation_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ContactInformation_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phone",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PhoneNumberType",
      "kind": "LinkedField",
      "name": "phoneNumber",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "countryCode",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "display",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "error",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isValid",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "originalNumber",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "regionCode",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '14e2de7c031099cb3329d0e029473d1a';
export default node;
