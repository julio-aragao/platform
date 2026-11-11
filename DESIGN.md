---
name: Aurora 2026
description: Identity system of Aurora Tecnologias (legal name: see Brand proper names) for documents, presentations, spreadsheets and brand.
colors:
  navy: "#102A63"
  indigo: "#2C539D"
  cyan: "#00ADE5"
  indigo-light: "#5C7FD0"
  ink: "#0E1A33"
  graphite: "#3A465E"
  slate: "#56617A"
  label: "#64708A"
  haze: "#9FB0CC"
  fog: "#C9D2DE"
  hairline: "#E2E7EE"
  frost: "#F2F5F9"
  paper: "#FFFFFF"
  success: "#0B6B45"
  success-bg: "#E7F4EE"
  warning: "#8A5A1A"
  warning-bg: "#FDF4E3"
  error: "#B03A3A"
  error-bg: "#FBE9E9"
typography:
  display:
    fontFamily: "IBM Plex Sans, Calibri, sans-serif"
    fontSize: "20pt"
    fontWeight: 400
    lineHeight: 1.2
  headline:
    fontFamily: "IBM Plex Sans, Calibri, sans-serif"
    fontSize: "11pt"
    fontWeight: 700
    letterSpacing: "normal"
  body:
    fontFamily: "IBM Plex Sans, Calibri, sans-serif"
    fontSize: "11pt"
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
    fontSize: "9pt"
    fontWeight: 400
  label:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
    fontSize: "8pt"
    fontWeight: 400
    letterSpacing: "0.14em"
  footer:
    fontFamily: "IBM Plex Sans, Calibri, sans-serif"
    fontSize: "8pt"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  margin-side: "25mm"
  margin-top: "20mm"
  margin-foot: "18mm"
  margin-notary-left: "30mm"
  margin-notary-right: "20mm"
  text-block: "160mm"
components:
  document-bar:
    backgroundColor: "{colors.navy}"
    height: "5px"
  document-label:
    textColor: "{colors.navy}"
    typography: "{typography.label}"
  clause-title:
    textColor: "{colors.navy}"
    typography: "{typography.headline}"
  footer:
    textColor: "{colors.slate}"
    typography: "{typography.footer}"
  overdue-state:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
---

# Design System: Aurora 2026

Revision 10/2026. Source of truth: the four sheets of the Aurora 2026 System and the files in the brand folder.

## Overview

**Creative North Star: "The letterhead you read in the data room"**

Aurora speaks to partners, lawyers, financiers and distributors. The system exists so that a contract, minutes or a plant datasheet look like they come from the same company: solid, technical and simple, whether printed at the notary's office or opened as a PDF in due diligence. Almost everything is paper: white background, navy ink, a bar at the top and data in a mono font.

Colour is used sparingly. Navy carries the institution; cyan is a signal, never text on a light background; indigo completes the icon. Typography is a single family, IBM Plex, with Mono reserved for what is measured: company tax ID (CNPJ), date, power, value, asset code.

The system is built to last outside Aurora: Word, PowerPoint and Excel templates that keep the identity when someone creates a new title, chart or column, because the theme and styles are already the brand's.

**Key Characteristics:**
- One brand, two descriptors (see Brand proper names), one reduced version
- White paper, navy ink, a single ornament: the navy and cyan bar
- IBM Plex Sans for text, IBM Plex Mono for data
- Reading contrast on all text, including labels and footers
- No rounding, no shadows

## Colors

Institutional navy, a supporting indigo, a signal cyan and a scale of bluish neutrals.

### Primary
- **Aurora Navy** `navy` (#102A63): institutional colour. Titles, wordmark, table header, cover and back-cover background. 13.5:1 on white.

### Secondary
- **Indigo** `indigo` (#2C539D): half of the icon. Links, second chart series, step numbers. 7.4:1 on white.
- **Light indigo** `indigo-light` (#5C7FD0): only in the negative version, in place of indigo on navy (3.5:1), and in large divider numbers.

### Tertiary
- **Cyan** `cyan` (#00ADE5): the bar, the hairline, the highlight, the first line series. As text, only on navy (5.3:1).

### Neutral
- **Ink** `ink` (#0E1A33): body text. 17.3:1.
- **Graphite** `graphite` (#3A465E): supporting text on screens.
- **Slate** `slate` (#56617A): secondary text and footer. 6.2:1.
- **Label** `label` (#64708A): labels and numbering; the lightest grey allowed for text. 5.0:1 on paper, 4.5:1 on frost.
- **Haze** `haze` (#9FB0CC): secondary text on navy. 6.2:1.
- **Fog** `fog` (#C9D2DE): strong hairline, dashes, witness line.
- **Hairline** `hairline` (#E2E7EE): rules and dividers.
- **Frost** `frost` (#F2F5F9): table, card and board background.
- **Paper** `paper` (#FFFFFF).

### States
- **Success** `success` (#0B6B45 on #E7F4EE), **Warning** `warning` (#8A5A1A on #FDF4E3), **Error** `error` (#B03A3A on #FBE9E9): only for status (deadline, pending item, data room document), always with the word alongside.

### Brand colour names (pt-BR)

The brand kit names the colours in Portuguese. This table maps each English token to its brand-kit name.

<!-- i18n-guard:ignore-start -->
| Token | Brand-kit name (pt-BR) |
| --- | --- |
| `navy` | navy |
| `indigo` | índigo |
| `cyan` | ciano |
| `indigo-light` | índigo claro |
| `ink` | tinta |
| `graphite` | grafite |
| `slate` | ardósia |
| `label` | rótulo |
| `haze` | bruma |
| `fog` | névoa |
| `hairline` | fio |
| `frost` | gelo |
| `paper` | papel |
| `success` | sucesso |
| `success-bg` | sucesso-fundo |
| `warning` | atenção |
| `warning-bg` | atenção-fundo |
| `error` | erro |
| `error-bg` | erro-fundo |
<!-- i18n-guard:ignore-end -->

### Brand proper names

Company and brand names are not translated. They appear here verbatim, as in the brand kit.

<!-- i18n-guard:ignore-start -->
| Name | Use |
| --- | --- |
| Aurora Tecnologias | Brand name with the first descriptor |
| Tecnologias | First descriptor |
| Pesquisa e Desenvolvimento | Second descriptor |
| Energias Renováveis | Legal-name suffix (razão social); goes in the footer, never inside the logo |
<!-- i18n-guard:ignore-end -->

### Named Rules
**The Cyan-Signal Rule.** Cyan is never text on a light background (2.6:1) and never receives white text. On navy, it may.
**The Label Rule.** No text uses a grey lighter than #64708A. The former #8A94A8 has left the system.
**The Tonal Band Rule.** The background never sits in the same tonal band as the brand: on cyan, only the monochrome navy; on navy, the negative with light indigo.

## Typography

**Body Font:** IBM Plex Sans (fallback Calibri)
**Label/Mono Font:** IBM Plex Mono (fallback Consolas)

**Character:** a technical, neutral family with uniform-height numerals that align tables of tax IDs and power. SIL OFL licence: installable and embeddable at no cost.

### Hierarchy
- **Display** (Regular 400, 20 pt, 1.2): document title, in navy.
- **Headline** (Bold, 11 pt, uppercase): clause title, Word style "Heading 1".
- **Body** (Regular 400, 11 pt, line height 1.5, justified): contract body, style "Normal".
- **Data** (Mono 400, 9–10 pt): item numbering, tax IDs, values, codes.
- **Label** (Mono 400, 8 pt, 0.14 em, uppercase): document label and field labels, in navy or #64708A.
- **Footer** (Regular 400, 8 pt): footer and numbering, in #56617A.

### Named Rules
**The 8 pt Floor Rule.** No document text falls below 8 pt; no screen text falls below 11 px.
**The Mono-Is-Measure Rule.** Mono appears only in data, codes and technical labels, never as decoration.

## Layout

A4 portrait. Margins of 25 mm on the sides, 20 mm at the top and 18 mm at the foot. Contracts, minutes and powers of attorney, which go to the notary's office, use 30 mm on the left and 20 mm on the right; the text block stays at 160 mm. The first page carries the full 72 mm signature under the bar; inner pages carry the 30 mm reduced version on the left and the document identification on the right, over a hairline. Footer on two lines: company name and tax ID (CNPJ) with the `page / total` numbering; address and website with the template reference and the revision.

Slides are 16:9 with nine layouts in the Slide Master. Spreadsheets have a navy header, frozen panes and print fitted to width, in landscape on the wide tabs.

## Elevation & Depth

Flat. No shadows. Depth comes from tone (frost under paper, navy under light text) and from 1 px hairlines.

## Shapes

Right angles everywhere. The only recurring shape is the icon's parallelogram; nothing imitates it. The document bar is 5 px, with the first 26% in cyan.

## Components

### Brand
- **Full signature:** two-colour icon, wordmark and descriptor aligned to the right of the wordmark, with fixed height (4% of the wordmark width) and letter spacing (0.33 em). Only from 72 mm or 360 px.
- **Reduced:** icon and wordmark, from 12 to 72 mm or from 48 to 360 px.
- **Icon:** below 12 mm or 48 px; avatar and favicon.
- **Clear space:** the height of the icon on all sides.
- **Files:** the brand folder holds SVG and PNG, a PDF subfolder (vector for print) and a web subfolder (avatar, favicon).

### Document header
- **First page:** navy and cyan bar; 72 mm signature.
- **Inner pages:** 30 mm reduced version on the left; identification in Mono 8 pt #64708A on the right; hairline #E2E7EE.

### Fill-in field
- Text in square brackets inside a Word content control: one click selects the whole field and typing replaces the text without breaking the formatting.

### Signature block
- Closing, place and date, signatures and witnesses in a single table, with rows that do not split and "keep with next" through the end; it carries the last paragraph of text along.

## Do's and Don'ts

### Do:
- **Do** use the templates in the templates folder as a starting point; the theme and styles are already the brand's.
- **Do** apply "Heading 1" to clauses and "Clause Item" to numbered items.
- **Do** use #64708A or darker on any label.
- **Do** re-export PNGs from the SVG with the whole viewBox.

### Don't:
- **Don't** put cyan text on white or a light background.
- **Don't** use the signature with descriptor below 72 mm or 360 px.
- **Don't** recolour the icon outside the kit's versions (positive, negative, monochrome).
- **Don't** put the legal-name suffix (see Brand proper names) inside the logo: it is the company's legal name and goes in the footer.
- **Don't** leave a page with only signatures.
