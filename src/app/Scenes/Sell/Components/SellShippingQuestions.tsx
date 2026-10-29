import { Flex, Text } from "@artsy/palette-mobile"
import { SellOption, SellOptionCards } from "app/Scenes/Sell/Components/SellOptionCards"

export type SellPackaging = "FRAMED" | "ROLLED" | "EITHER"
export type SellPacker = "SELLER" | "COURIER" | "EITHER"
export type SellDelivery = "DROP_OFF" | "COLLECTION" | "EITHER"

export interface SellShippingAnswers {
  packaging: SellPackaging | null
  packer: SellPacker | null
  delivery: SellDelivery | null
}

export const EMPTY_SELL_SHIPPING: SellShippingAnswers = {
  packaging: null,
  packer: null,
  delivery: null,
}

const EITHER_DESCRIPTION = "Either option works for you."

const PACKAGING_OPTIONS: SellOption<SellPackaging>[] = [
  { value: "FRAMED", title: "Framed", description: "Sold and shipped framed." },
  {
    value: "ROLLED",
    title: "Rolled",
    description: "Removed from the frame and shipped in a tube.",
  },
  { value: "EITHER", title: "Open to both", description: EITHER_DESCRIPTION },
]

const PACKER_OPTIONS: SellOption<SellPacker>[] = [
  { value: "SELLER", title: "I'll pack it", description: "You pack the work securely." },
  {
    value: "COURIER",
    title: "Courier packs",
    description: "The courier packs the work for you.",
  },
  { value: "EITHER", title: "Open to both", description: EITHER_DESCRIPTION },
]

const DELIVERY_OPTIONS: SellOption<SellDelivery>[] = [
  {
    value: "DROP_OFF",
    title: "I'll drop off to courier",
    description: "Bring the packed work to a courier.",
  },
  {
    value: "COLLECTION",
    title: "Courier needs to collect",
    description: "A courier collects the artwork from your location.",
  },
  { value: "EITHER", title: "Open to both", description: EITHER_DESCRIPTION },
]

interface SellShippingQuestionsProps {
  value: SellShippingAnswers
  onChange: React.Dispatch<React.SetStateAction<SellShippingAnswers>>
  /** The first question unlocks once the location is complete */
  disabled: boolean
}

/** Each question stays locked until the one before it is answered */
export const SellShippingQuestions: React.FC<SellShippingQuestionsProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const update = (answer: Partial<SellShippingAnswers>) =>
    onChange((current) => ({ ...current, ...answer }))

  return (
    <Flex gap={4}>
      <SellShippingQuestion
        question="How will this be packed?"
        options={PACKAGING_OPTIONS}
        value={value.packaging}
        onChange={(packaging) => update({ packaging })}
        disabled={disabled}
      />
      <SellShippingQuestion
        question="Who will be packing the work?"
        options={PACKER_OPTIONS}
        value={value.packer}
        onChange={(packer) => update({ packer })}
        disabled={disabled || !value.packaging}
      />
      <SellShippingQuestion
        question="How will the work get to its buyer?"
        options={DELIVERY_OPTIONS}
        value={value.delivery}
        onChange={(delivery) => update({ delivery })}
        disabled={disabled || !value.packaging || !value.packer}
      />
    </Flex>
  )
}

interface SellShippingQuestionProps<T extends string> {
  question: string
  options: SellOption<T>[]
  value: T | null
  onChange: (value: T) => void
  disabled: boolean
}

const SellShippingQuestion = <T extends string>({
  question,
  options,
  value,
  onChange,
  disabled,
}: SellShippingQuestionProps<T>) => (
  <Flex gap={1} opacity={disabled ? 0.3 : 1}>
    <Text variant="sm" px={2}>
      {question}
    </Text>
    <SellOptionCards options={options} value={value} onChange={onChange} disabled={disabled} />
  </Flex>
)

export const areSellShippingAnswersComplete = ({
  packaging,
  packer,
  delivery,
}: SellShippingAnswers) => !!packaging && !!packer && !!delivery
