import { SupportedSellChannel } from "app/utils/sellChannels"
import * as Yup from "yup"

/** Step 2’s answers are complete when this passes. A listing also needs an asking price. */
export const sellConditionSchema = (channel: SupportedSellChannel) =>
  Yup.object().shape({
    rating: Yup.string().nullable().required(),
    askingPrice:
      channel === "MARKETPLACE"
        ? Yup.string()
            .required()
            .matches(/^[1-9]\d*$/)
        : Yup.string(),
  })
