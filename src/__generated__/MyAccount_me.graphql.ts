/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuthenticationProvider = "APPLE" | "FACEBOOK" | "GOOGLE" | "%future added value";
export type SecondFactorKind = "app" | "backup" | "sms" | "%future added value";
export type MyAccount_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly phone: string | null;
    readonly paddleNumber: string | null;
    readonly hasPassword: boolean;
    readonly authentications: ReadonlyArray<{
        readonly provider: AuthenticationProvider;
    }>;
    readonly secondFactors: ReadonlyArray<{
        readonly kind: SecondFactorKind;
    } | null> | null;
    readonly " $refType": "MyAccount_me";
};
export type MyAccount_me$data = MyAccount_me;
export type MyAccount_me$key = {
    readonly " $data"?: MyAccount_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyAccount_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyAccount_me",
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
      "kind": "ScalarField",
      "name": "paddleNumber",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPassword",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AuthenticationType",
      "kind": "LinkedField",
      "name": "authentications",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "provider",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "kinds",
          "value": [
            "sms",
            "app",
            "backup"
          ]
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "secondFactors",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "kind",
          "storageKey": null
        }
      ],
      "storageKey": "secondFactors(kinds:[\"sms\",\"app\",\"backup\"])"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '859df82a70085d2305c810743ea7cf6a';
export default node;
