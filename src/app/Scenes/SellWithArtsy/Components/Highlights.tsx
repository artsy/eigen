// import { Column, GridColumns, Text } from "@artsy/palette"
// import { DollarCircleIcon } from "Apps/Consign/Routes/MarketingLanding/Components/LandingPage/DollarCircleIcon"
// import { StarCircleIcon } from "Apps/Consign/Routes/MarketingLanding/Components/LandingPage/StarCircleIcon"
// import { PlanetCircleIcon } from "Apps/Consign/Routes/MarketingLanding/Components/LandingPage/PlanetCircleIcon"

// import { ReactElement } from "react"

// const reasons = [
//   {
//     icon: <DollarCircleIcon height={30} width={30} />,
//     title: "Net more from your sale",
//     text: "With lower fees than traditional auction houses and dealers, and no listing fees, you take home more of the final sale price.",
//   },
//   {
//     icon: <StarCircleIcon height={50} width={50} />,
//     title: "Tap into our expertise",
//     text: "Our team has a wealth of experience in the secondary art market. A dedicated specialist will be with you every step of the way.",
//   },
//   {
//     icon: <PlanetCircleIcon height={50} width={50} />,
//     title: "Reach a global network",
//     text: "We connect your work with the most interested buyers from over 3 million art lovers in 190 countries.",
//   },
// ]

// export const Highlights: React.FC = () => {
//   return (
//     <GridColumns gridColumnGap={[0, 6]} alignItems="fex-start">
//       {reasons.map((i) => (
//         <RowItem icon={i.icon} title={i.title} text={i.text} />
//       ))}
//     </GridColumns>
//   )
// }

// interface RowItemProps {
//   icon: ReactElement
//   title: string
//   text: string
// }
// const RowItem: React.FC<RowItemProps> = ({ icon, title, text }) => {
//   return (
//     <Column span={4} pr={[0, 2]} mb={[2, 0]}>
//       {icon}
//       <Text mt={[0.5, 2]} variant={["md", "xl"]}>
//         {title}
//       </Text>
//       <Text mt={[0.5, 1]} variant={["xs", "sm"]}>
//         {text}
//       </Text>
//     </Column>
//   )
// }
