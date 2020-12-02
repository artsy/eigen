/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerEntityHeader_partner = {
    readonly href: string | null;
    readonly name: string | null;
    readonly cities: ReadonlyArray<string | null> | null;
    readonly isDefaultProfilePublic: boolean | null;
    readonly initials: string | null;
    readonly profile: {
        readonly icon: {
            readonly url: string | null;
        } | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerFollowButton_partner">;
    readonly " $refType": "PartnerEntityHeader_partner";
};
export type PartnerEntityHeader_partner$data = PartnerEntityHeader_partner;
export type PartnerEntityHeader_partner$key = {
    readonly " $data"?: PartnerEntityHeader_partner$data;
    readonly " $fragmentRefs": FragmentRefs<"PartnerEntityHeader_partner">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PartnerEntityHeader_partner",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
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
      "name": "cities",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDefaultProfilePublic",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "initials",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "icon",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "square140"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"square140\")"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerFollowButton_partner"
    }
  ],
  "type": "Partner",
  "abstractKey": null
};
(node as any).hash = '5239c02e35841cdf49573a76b9a13b78';
export default node;
