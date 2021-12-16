/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Trove_trove = {
    readonly heroUnits: ReadonlyArray<{
        readonly title: string | null;
        readonly subtitle: string | null;
        readonly creditLine: string | null;
        readonly href: string | null;
        readonly backgroundImageURL: string | null;
    } | null> | null;
    readonly " $refType": "Trove_trove";
};
export type Trove_trove$data = Trove_trove;
export type Trove_trove$key = {
    readonly " $data"?: Trove_trove$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"Trove_trove">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "heroImageVersion"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Trove_trove",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "platform",
          "value": "MOBILE"
        }
      ],
      "concreteType": "HomePageHeroUnit",
      "kind": "LinkedField",
      "name": "heroUnits",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "subtitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "creditLine",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "href",
          "storageKey": null
        },
        {
          "alias": null,
          "args": [
            {
              "kind": "Variable",
              "name": "version",
              "variableName": "heroImageVersion"
            }
          ],
          "kind": "ScalarField",
          "name": "backgroundImageURL",
          "storageKey": null
        }
      ],
      "storageKey": "heroUnits(platform:\"MOBILE\")"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
(node as any).hash = 'f4d29f9c7f0884383378c66642d6193c';
export default node;
