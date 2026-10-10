// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { sendEmailWithMailTo } from "app/utils/sendEmail"

export const openMarkdownLink = (url: string, { modal = false }: { modal?: boolean } = {}) => {
  if (url.startsWith("mailto:")) {
    sendEmailWithMailTo(url)
  } else if (modal) {
    navigate(url, { modal: true })
  } else {
    navigate(url)
  }
}
