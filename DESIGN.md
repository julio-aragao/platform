---
name: Aurora 2026
description: Sistema de identidade da Aurora Tecnologias para documentos, apresentações, planilhas e marca.
colors:
  navy: "#102A63"
  indigo: "#2C539D"
  ciano: "#00ADE5"
  indigo-negativo: "#5C7FD0"
  tinta: "#0E1A33"
  grafite: "#3A465E"
  ardosia: "#56617A"
  rotulo: "#64708A"
  bruma: "#9FB0CC"
  nevoa: "#C9D2DE"
  fio: "#E2E7EE"
  gelo: "#F2F5F9"
  papel: "#FFFFFF"
  sucesso: "#0B6B45"
  sucesso-fundo: "#E7F4EE"
  atencao: "#8A5A1A"
  atencao-fundo: "#FDF4E3"
  erro: "#B03A3A"
  erro-fundo: "#FBE9E9"
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
  margem-lateral: "25mm"
  margem-topo: "20mm"
  margem-pe: "18mm"
  margem-cartorio-esquerda: "30mm"
  margem-cartorio-direita: "20mm"
  mancha: "160mm"
components:
  barra-documento:
    backgroundColor: "{colors.navy}"
    height: "5px"
  rotulo-documento:
    textColor: "{colors.navy}"
    typography: "{typography.label}"
  titulo-clausula:
    textColor: "{colors.navy}"
    typography: "{typography.headline}"
  rodape:
    textColor: "{colors.ardosia}"
    typography: "{typography.footer}"
  estado-vencido:
    backgroundColor: "{colors.erro-fundo}"
    textColor: "{colors.erro}"
---

# Design System: Aurora 2026

Revisão 10/2026. Fonte da verdade: as quatro folhas do Sistema Aurora 2026 e os arquivos em `AURORA 2026/`.

## Overview

**Creative North Star: "O papel timbrado que se lê no data room"**

A Aurora fala com sócios, advogados, financiadores e distribuidoras. O sistema existe para que um contrato, uma ata ou uma ficha de usina pareçam da mesma empresa sólida, técnica e simples, impressos no cartório ou abertos em PDF numa due diligence. Quase tudo é papel: fundo branco, tinta navy, uma barra no topo e dados em fonte mono.

A cor é economizada. O navy carrega a instituição; o ciano é um sinal, nunca um texto sobre fundo claro; o índigo completa o ícone. A tipografia é uma família só, IBM Plex, com a Mono reservada para o que é medida: CNPJ, data, potência, valor, código de ativo.

O sistema foi feito para durar fora da Aurora: modelos de Word, PowerPoint e Excel que mantêm a identidade quando alguém cria um título, um gráfico ou uma coluna nova, porque o tema e os estilos já são os da marca.

**Key Characteristics:**
- Uma marca, dois descritores (Tecnologias e Pesquisa e Desenvolvimento), uma reduzida
- Papel branco, tinta navy, um único ornamento: a barra navy e ciano
- IBM Plex Sans para texto, IBM Plex Mono para dados
- Contraste de leitura em todo texto, inclusive rótulos e rodapés
- Nenhum arredondamento, nenhuma sombra

## Colors

Navy institucional, um índigo de apoio, um ciano de sinal e uma escala de neutros azulados.

### Primary
- **Navy Aurora** (#102A63): cor institucional. Títulos, wordmark, cabeçalho de tabela, fundo de capa e contracapa. 13,5:1 no branco.

### Secondary
- **Índigo** (#2C539D): metade do ícone. Links, segunda série de gráfico, números de etapa. 7,4:1 no branco.
- **Índigo claro** (#5C7FD0): só na negativa, no lugar do índigo sobre navy (3,5:1), e em número grande de divisória.

### Tertiary
- **Ciano** (#00ADE5): a barra, o fio, o realce, a primeira série de linha. Em texto, só sobre navy (5,3:1).

### Neutral
- **Tinta** (#0E1A33): corpo de texto. 17,3:1.
- **Grafite** (#3A465E): texto de apoio nas telas.
- **Ardósia** (#56617A): texto secundário e rodapé. 6,2:1.
- **Rótulo** (#64708A): rótulos e numeração; o cinza mais claro permitido em texto. 5,0:1 no papel, 4,5:1 no gelo.
- **Bruma** (#9FB0CC): texto secundário sobre navy. 6,2:1.
- **Névoa** (#C9D2DE): fio forte, tracejado, linha de testemunha.
- **Fio** (#E2E7EE): fios e divisórias.
- **Gelo** (#F2F5F9): fundo de tabela, cartão e prancha.
- **Papel** (#FFFFFF).

### Estados
- **Sucesso** (#0B6B45 sobre #E7F4EE), **Atenção** (#8A5A1A sobre #FDF4E3), **Erro** (#B03A3A sobre #FBE9E9): só para situação (prazo, pendência, documento do data room), sempre com a palavra junto.

### Named Rules
**The Ciano-Sinal Rule.** O ciano nunca é texto sobre fundo claro (2,6:1) e nunca recebe texto branco. Sobre navy, pode.
**The Rótulo Rule.** Nenhum texto usa cinza mais claro que #64708A. O antigo #8A94A8 saiu do sistema.
**The Faixa Tonal Rule.** O fundo nunca fica na mesma faixa tonal da marca: sobre ciano, só a monocromática navy; sobre navy, a negativa com índigo claro.

## Typography

**Body Font:** IBM Plex Sans (fallback Calibri)
**Label/Mono Font:** IBM Plex Mono (fallback Consolas)

**Character:** uma família técnica e neutra, com números de altura uniforme que alinham tabelas de CNPJ e potência. Licença SIL OFL: instalável e incorporável sem custo.

### Hierarchy
- **Display** (Regular 400, 20 pt, 1,2): título do documento, em navy.
- **Headline** (Bold, 11 pt, caixa-alta): título de cláusula, estilo "Título 1" do Word.
- **Body** (Regular 400, 11 pt, entrelinha 1,5, justificado): corpo de contrato, estilo "Normal".
- **Data** (Mono 400, 9–10 pt): numeração de item, CNPJ, valores, códigos.
- **Label** (Mono 400, 8 pt, 0,14 em, caixa-alta): rótulo do documento e rótulos de campo, em navy ou #64708A.
- **Footer** (Regular 400, 8 pt): rodapé e numeração, em #56617A.

### Named Rules
**The 8 pt Floor Rule.** Nenhum texto de documento fica abaixo de 8 pt; nenhum texto de tela fica abaixo de 11 px.
**The Mono-É-Medida Rule.** A Mono só aparece em dado, código e rótulo técnico, nunca como enfeite.

## Layout

A4 retrato. Margens de 25 mm nas laterais, 20 mm no topo e 18 mm no pé. Contrato, ata e procuração, que vão a cartório, usam 30 mm à esquerda e 20 mm à direita; a mancha continua com 160 mm. Primeira página com a assinatura completa de 72 mm sob a barra; páginas internas com a reduzida de 30 mm à esquerda e a identificação do documento à direita, sobre um fio. Rodapé em duas linhas: razão social e CNPJ com a numeração `página / total`; endereço e site com a referência do modelo e a revisão.

Slides 16:9 com nove layouts no Slide Master. Planilha com cabeçalho navy, painéis congelados e impressão ajustada à largura, em paisagem nas abas largas.

## Elevation & Depth

Plano. Nenhuma sombra. A profundidade vem de tom (gelo sob papel, navy sob texto claro) e de fios de 1 px.

## Shapes

Ângulo reto em tudo. A única forma recorrente é o paralelogramo do ícone; nada a imita. A barra de documento tem 5 px, com os primeiros 26% em ciano.

## Components

### Marca
- **Assinatura completa:** ícone bicolor, wordmark e descritor alinhado à direita do wordmark, com altura (4% da largura do wordmark) e entreletras (0,33 em) fixos. Só a partir de 72 mm ou 360 px.
- **Reduzida:** ícone e wordmark, de 12 a 72 mm ou de 48 a 360 px.
- **Ícone:** abaixo de 12 mm ou 48 px; avatar e favicon.
- **Respiro:** a altura do ícone em todos os lados.
- **Arquivos:** `Marca/` (SVG e PNG), `Marca/PDF/` (vetor para gráfica), `Marca/Web/` (avatar, favicon).

### Cabeçalho de documento
- **Primeira página:** barra navy e ciano; assinatura de 72 mm.
- **Internas:** reduzida de 30 mm à esquerda; identificação em Mono 8 pt #64708A à direita; fio #E2E7EE.

### Campo a preencher
- Texto entre colchetes dentro de um controle de conteúdo do Word: um clique seleciona o campo inteiro e a digitação substitui o texto sem desmanchar a formatação.

### Bloco de assinatura
- Fecho, local e data, assinaturas e testemunhas numa tabela só, com linhas que não se dividem e "manter com o próximo" até o fim; leva junto o último parágrafo de texto.

## Do's and Don'ts

### Do:
- **Do** usar os modelos de `Templates/` como ponto de partida; tema e estilos já são os da marca.
- **Do** aplicar "Título 1" às cláusulas e "Item de cláusula" aos itens numerados.
- **Do** usar #64708A ou mais escuro em qualquer rótulo.
- **Do** reexportar PNGs a partir do SVG com o viewBox inteiro.

### Don't:
- **Don't** pôr texto ciano sobre branco ou fundo claro.
- **Don't** usar a assinatura com descritor abaixo de 72 mm ou 360 px.
- **Don't** recolorir o ícone fora das versões do kit (positiva, negativa, monocromática).
- **Don't** pôr "Energias Renováveis" dentro do logo: é razão social, vai no rodapé.
- **Don't** deixar uma página só com assinaturas.
