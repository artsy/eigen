import { AnimatePresence, MotiView } from "moti"

export const FadeInLeft: React.FC<{ show: boolean; children?: React.ReactNode }> = ({ children, show }) => {
  return (
    <AnimatePresence>
      {!!show && (
        <MotiView
          from={{
            translateX: -10,
            opacity: 0,
          }}
          animate={{
            translateX: 0,
            opacity: 1,
          }}
          exit={{
            translateX: -10,
            opacity: 0,
          }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  )
}
