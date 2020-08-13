import { createGlobalStyle, css } from "styled-components"
import { Display, Sans, Serif } from "../elements/Typography"
import { color } from "./color"

/**
 * Injects globally relevant styles, including helper classes for our Typography.
 * Apps that use palette should mount this component at the root of their tree.
 */
export function injectGlobalStyles<P>(
  additionalStyles?: string | ReturnType<typeof css>
) {
  const GlobalStyles = createGlobalStyle<P>`
    html {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      -ms-overflow-style: scrollbar;
    }

    *,
    *::before,
    *::after {
      -webkit-box-sizing: inherit;
              box-sizing: inherit;
    }

    html,
    body,
    #root {
      -webkit-tap-highlight-color: transparent;
      height: 100%;
    }

    body {
      margin: 0;
      padding: 0;
    }

    html, body {
      font-family: 'AGaramondPro-Regular';
      font-size: 16px;
      line-height: 24px;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    /* Default links */

    a {
      cursor: pointer;
      color: inherit;
      transition: color 0.25s;
      text-decoration: underline;

      &:hover {
        color: ${color("black100")};
      }

      &:active {
        color: ${color("black100")};
      }

      /* ts-styled-plugin erroniously parses this; see: */
      /* https://github.com/Microsoft/typescript-styled-plugin/issues/54 */
      &.noUnderline {
        ${noUnderline};
      }

      &.colorLink {
        ${noUnderline};
        ${colorLink};
      }
    }

    /* <Sans /> links */

    ${Sans} {
      a {
        color: inherit;
        &:hover {
          color: ${color("black100")};
        }
        &:active {
          color: ${color("black100")};
        }
        &.noUnderline {
          ${noUnderline};
        }
        &.colorLink {
          ${noUnderline};
          ${colorLink};
        }
      }
    }

    /* <Serif /> links */

    ${Serif} {
      a {
        color: inherit;
        &:hover {
          color: ${color("black100")};
        }
        &:active {
          color: ${color("black100")};
        }
        &.noUnderline {
          ${noUnderline};
        }
        &.colorLink {
          ${noUnderline};
          ${colorLink};
        }
      }
    }

    /* <Display /> links */

    ${Display} {
      a {
        color: ${color("black100")};
        &:hover {
          text-decoration: underline;
        }
      }
    }

    h1, h2, h3, h4, h5, h6 {
      font-style: inherit;
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
      margin: 0;
    }

    ${additionalStyles};
  `

  GlobalStyles.displayName = "GlobalStyles"

  return {
    GlobalStyles,
  }
}

// Mixins
const noUnderline = css`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const colorLink = css`
  color: ${color("purple100")};
`
