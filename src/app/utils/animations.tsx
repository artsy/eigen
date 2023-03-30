import { AnimatePresence, View } from "moti"

export const FadeInRight: React.FC<{ show: boolean }> = ({ children, show }) => {
  return (
    <AnimatePresence>
      {!!show && (
        <View
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
        </View>
      )}
    </AnimatePresence>
  )
}
