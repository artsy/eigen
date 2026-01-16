import { Box, LinkText, Screen, Text } from "@artsy/palette-mobile"
import { HTML } from "app/Components/HTML"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"

const CREDIT = {
  repo: "cbracco/html5-test-page",
  url: "https://github.com/cbracco/html5-test-page",
}

export const HTMLTest: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="HTML Test" onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="xl">HTML Test</Text>

          <Text variant="xs" mt={1} color="mono60">
            This screen provides a kitchen sink test of the HTML component used throughout the app.
          </Text>

          <Text variant="xs" mt={1} color="mono60">
            Adapted from{" "}
            <LinkText variant="xs" accessibilityRole="link" onPress={() => navigate(CREDIT.url)}>
              {CREDIT.repo}
            </LinkText>
          </Text>

          <Section title="Headings" html={headings} />
          <Section title="Paragraphs" html={paragraphs} />
          <Section title="Lists" html={lists} />
          <Section title="Blockquote" html={blockquote} />
          <Section title="Details" html={details} />
          <Section title="Horizontal Rule" html={rule} />
          <Section title="Table" html={table} />
          <Section title="Code" html={code} />
          <Section title="Inline elements" html={inline} />
          <Section title="Comments" html={comments} />
          <Section title="Images" html={images} />
          <Section title="Audio" html={audio} />
          <Section title="Video" html={video} />
          <Section title="Canvas" html={canvas} />
          <Section title="SVG" html={svg} />
          <Section title="IFrame" html={iframe} />
          <Section title="Embed" html={embed} />
          <Section title="Object" html={object} />
          <Section title="Meter" html={meter} />
          <Section title="Progress" html={progress} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

interface SectionProps {
  title: string
  html: string
}

const Section: React.FC<SectionProps> = ({ title, html }) => {
  return (
    <Box my={2} borderTopWidth={1} borderTopColor="mono10" pt={2}>
      <Text variant="xl" color="brand" pb={1}>
        {title}
      </Text>

      <HTML html={html} />
    </Box>
  )
}

const headings = `
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
`

const paragraphs = `
<p>These paragraphs are rendered via plain &lt;p&gt; tags.</p>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non labore optio natus quas accusamus facilis id quae. Ducimus ullam quibusdam qui impedit at maxime illum est? Ipsa incidunt nihil cumque.</p>
<p>Ab tenetur, labore, dolore molestias vitae similique doloremque porro sed officiis, nihil fugit? Id soluta unde odit minima? Esse laudantium est quas!</p>
`

const blockquote = `
<blockquote>
  <p>A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text.</p>
  <p>It is typically distinguished visually using indentation and a different typeface or smaller size quotation. It may or may not include a citation, usually placed at the bottom.</p>
  <cite>—Example citation</cite>
</blockquote>
`

const lists = `
<div>
  <h3>Dictionary List</h3>
  <dl>
    <dt>Dictionary List term</dt>
    <dd>This is a Dictionary List definition.</dd>
    <dt>Another term</dt>
    <dd>Another definition.</dd>
  </dl>
  <h3>Ordered List</h3>
  <ol type="1">
    <li>List Item 1</li>
    <li>
      List Item 2
      <ol type="A">
        <li>List Item 1</li>
        <li>
          List Item 2
          <ol type="a">
            <li>List Item 1</li>
            <li>
              List Item 2
              <ol type="I">
                <li>List Item 1</li>
                <li>
                  List Item 2
                  <ol type="i">
                    <li>List Item 1</li>
                    <li>List Item 2</li>
                    <li>List Item 3</li>
                  </ol>
                </li>
                <li>List Item 3</li>
              </ol>
            </li>
            <li>List Item 3</li>
          </ol>
        </li>
        <li>List Item 3</li>
      </ol>
    </li>
    <li>List Item 3</li>
  </ol>
  <h3>Unordered List</h3>
  <ul>
    <li>List Item 1</li>
    <li>
      List Item 2
      <ul>
        <li>List Item 1</li>
        <li>
          List Item 2
          <ul>
            <li>List Item 1</li>
            <li>
              List Item 2
              <ul>
                <li>List Item 1</li>
                <li>
                  List Item 2
                  <ul>
                    <li>List Item 1</li>
                    <li>List Item 2</li>
                    <li>List Item 3</li>
                  </ul>
                </li>
                <li>List Item 3</li>
              </ul>
            </li>
            <li>List Item 3</li>
          </ul>
        </li>
        <li>List Item 3</li>
      </ul>
    </li>
    <li>List Item 3</li>
  </ul>
</div>
`

const details = `
<p>A &lt;details&gt; element with &lt;summary&gt;:</p>
<details>
  <summary>Expand for details</summary>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, odio! Odio natus ullam ad quaerat, eaque necessitatibus, aliquid distinctio similique voluptatibus dicta consequuntur animi. Quaerat facilis quidem unde eos! Ipsa.</p>
</details>
`

const rule = `
<hr>
`

const table = `
<table>
  <caption>Table Caption</caption>
  <thead>
    <tr>
      <th>Table Heading 1</th>
      <th>Table Heading 2</th>
      <th>Table Heading 3</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <th>Table Footer 1</th>
      <th>Table Footer 2</th>
      <th>Table Footer 3</th>
    </tr>
  </tfoot>
  <tbody>
    <tr>
      <td>Table Row 1 Cell 1</td>
      <td>Table Row 1 Cell 2</td>
      <td>Table Row 1 Cell 3</td>
    </tr>
    <tr>
      <td>Table Row 2 Cell 1</td>
      <td>Table Row 2 Cell 2</td>
      <td>Table Row 2 Cell 3</td>
    </tr>
    <tr>
      <td>Table Row 3 Cell 1</td>
      <td>Table Row 3 Cell 2</td>
      <td>Table Row 3 Cell 3</td>
    </tr>
  </tbody>
</table>
`

const code = `
<div>
  <p><strong>Keyboard input:</strong> <kbd>Cmd</kbd></p>
  <p><strong>Inline code:</strong> <code>&lt;div&gt;code&lt;/div&gt;</code></p>
  <p><strong>Sample output:</strong> <samp>This is sample output from a computer program.</samp></p>
  <p>Pre-formatted text:</p>
  <pre>P R E F O R M A T T E D T E X T
! " # $ % &amp; ' ( ) * + , - . /
0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ?
@ A B C D E F G H I J K L M N O
P Q R S T U V W X Y Z [ \ ] ^ _
a b c d e f g h i j k l m n o
p q r s t u v w x y z { | } ~ </pre>
</div>
`

const inline = `
<p><a href="https://www.github.com">This is a text link</a> (to github.com)</p>
<p><strong>Strong is used to indicate strong importance.</strong></p>
<p><em>This text has added emphasis.</em></p>
<p>The <b>b element</b> is stylistically different text from normal text, without any special importance.</p>
<p>The <i>i element</i> is text that is offset from the normal text.</p>
<p>The <u>u element</u> is text with an unarticulated, though explicitly rendered, non-textual annotation.</p>
<p><del>This text is deleted</del> and <ins>This text is inserted</ins>.</p>
<p><s>This text has a strikethrough</s>.</p>
<p>Superscript<sup>42</sup>.</p>
<p>Subscript<sub>42</sub>.</p>
<p><small>This small text is small for fine print, etc.</small></p>
<p>Abbreviation: <abbr title="HyperText Markup Language">HTML</abbr></p>
<p><q cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q">This text is a short inline quotation.</q></p>
<p><cite>This is a citation.</cite></p>
<p>The <dfn>dfn element</dfn> indicates a definition.</p>
<p>The <mark>mark element</mark> indicates a highlight.</p>
<p>The <var>variable element</var>, such as <var>x</var> = <var>y</var>.</p>
<p>The time element: <time datetime="2013-04-06T12:32+00:00">2 weeks ago</time></p>
`

const comments = `
<p>Code comments should <em>not</em> be displayed in the output.</p>
<p>There is an inline comment here: <!--This comment should not be displayed--></p>
<p>There is a multiline comment, including html tags, below here:</p>
<!--
<p><a href="#!">This is a text link. But it should not be displayed in a comment</a>.</p>
<p><strong>Strong is used to indicate strong importance. But, it should not be displayed in a comment</strong></p>
<p><em>This text has added emphasis. But, it should not be displayed in a comment</em></p>
-->
`

const images = `
<p>Plain &lt;img&gt; element</p>
<p><img src="https://placecats.com/480/480" alt="Photo of a cat"></p>

<p>&lt;figure&gt; element with &lt;img&gt; element</p>
<figure><img src="https://placecats.com/480/480" alt="Photo of a cat"></figure><br/>

<p>&lt;figure&gt; element with &lt;img&gt; and &lt;figcaption&gt; elements</p>
<figure>
  <img src="https://placecats.com/480/480" alt="Photo of a cat">
  <figcaption>Here is a caption for this image.</figcaption><br/>
</figure>

<p>&lt;figure&gt; element with a &lt;picture&gt; element</p>
<figure>
  <picture>
    <source srcset="https://placecats.com/800/800"
      media="(min-width: 800px)">
    <img src="https://placecats.com/480/480" alt="Photo of a cat" />
  </picture>
</figure><br/>
`

const audio = `
<p>&lt;audio&gt; element:</p>
<audio controls="">audio</audio>
`

const video = `
<p>&lt;video&gt; element:</p>
<div><video controls="">video</video></div>
`

const canvas = `
<p>&lt;canvas&gt; element:</p>
<canvas>canvas</canvas>
`

const svg = `
<p>&lt;svg&gt; element:</p>
<svg width="100px" height="100px">
<circle cx="100" cy="100" r="100" fill="#1fa3ec"></circle>
</svg>
`

const iframe = `
<p>&lt;iframe&gt; element:</p>
<iframe src="https://www.example.com" height="300"></iframe>
`

const embed = `
<p>&lt;embed&gt; element:</p>
<embed src="https://www.example.com" height="300"></embed>
`

const object = `
<p>&lt;object&gt; element:</p>
<object data="https://www.example.com" height="300"></object>
`

const meter = `
<p>&lt;meter&gt; element:</p>
<meter value="2" min="0" max="10">2 out of 10</meter>
`

const progress = `
<p>&lt;progress&gt; element:</p>
<progress>progress</progress>
`
