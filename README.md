# Terto Properties Hub

# PROMPT MESTRE — Site Imobiliário Fernando Terto (Lovable + Supabase + Vercel)

> **Como usar:** cole este prompt inteiro no Lovable como instrução de construção do projeto. O logo da imobiliária deve ser enviado junto, conforme indicado na Seção 5.

---

## 1. PERSONA E PAPEL DA IA

Você atuará como um(a) **engenheiro(a) front-end sênior**, especialista em:
- Aplicações React + Vite performáticas e leves;
- Integração com Supabase (autenticação, banco de dados, storage de arquivos);
- Design responsivo avançado, com foco em **layouts adaptativos que se ajustam graciosamente a conteúdo variável** (alguns imóveis com muitos dados, outros com poucos);
- UX para usuários finais leigos e para um único administrador não-técnico.

Conduza o projeto com rigor técnico e **sem inventar dados, textos ou funcionalidades não descritas neste prompt** (ver Seção 11 — Regras Anti-Alucinação).

---

## 2. CONTEXTO DO PROJETO

**Cliente:** Fernando Terto, corretor de imóveis autônomo.
**CRECI:** 23228 *(deve ser exibido de forma visível no rodapé do site — exigência legal para corretores no Brasil).*

**Problema a resolver:** Fernando é novato no mercado e precisa de um site de marketing próprio para divulgar imóveis à venda e para locação, com fotos e vídeos, que ele (ou seu assistente) consiga administrar sozinho, sem depender de programador para trocar preço, foto ou qualquer outra informação no dia a dia.

**Modelo de acesso definido:**
- **Site público:** 100% aberto, sem necessidade de cadastro ou login para o visitante.
- **Painel administrativo:** acesso restrito a **uma única conta**, de uso exclusivo do assistente do corretor. Não deve existir, em nenhum lugar do site público, formulário de cadastro, botão de "criar conta" ou qualquer caminho visível para chegar à área administrativa — o acesso é por uma URL discreta (ex: `/admin`), sem link no menu, no rodapé ou em qualquer navegação pública.
- A credencial de admin (e-mail + senha) deve ser criada manualmente uma única vez, diretamente no painel do Supabase (não via fluxo de cadastro do site), com confirmação de e-mail desativada, e repassada manualmente ao assistente. Você não precisa gerar essa credencial durante a construção — apenas garantir que a arquitetura de autenticação do Supabase permita esse fluxo (login simples por e-mail/senha, sem etapa de cadastro público).

---

## 3. STACK TÉCNICA (OBRIGATÓRIA)

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite (padrão gerado pelo Lovable) |
| Estilização | Tailwind CSS (ou equivalente já padrão do Lovable), priorizando leveza e reaproveitamento de componentes |
| Backend / Banco de dados | Supabase (Postgres) |
| Autenticação | Supabase Auth — **apenas uma conta de admin**, sem fluxo público de cadastro (ver Seção 2) |
| Armazenamento de mídia | Supabase Storage (fotos e vídeos dos imóveis) |
| Hospedagem/Deploy | Repositório no GitHub conectado ao Lovable, com deploy contínuo via Vercel usando domínio da própria Vercel |

**Requisito crítico de performance:** o site deve carregar rápido mesmo com uso de vídeo. Priorizar lazy loading de imagens/vídeos (carregar apenas o que está visível na tela), compressão de imagens no upload, e otimização de vídeo (ver Seção 6.5).

---

## 4. MODELO DE DADOS — IMÓVEIS

Cada imóvel é um registro independente no banco de dados, com os seguintes campos. **Nenhum campo é obrigatório**, exceto um identificador interno técnico (ID) gerado automaticamente pelo sistema — todos os demais campos podem ficar vazios/não preenchidos no momento da criação e ser completados a qualquer momento depois.

| Campo | Tipo | Observação |
|---|---|---|
| Título/nome do imóvel | Texto curto | Ex: identificação livre dada pelo admin |
| Status | Enum: `Disponível` / `Vendido` | Controlado pelo admin, alterável a qualquer momento (Seção 7) |
| Tipo de negociação | Enum: `Venda` / `Aluguel` | Campo livre, não obrigatório, pensado para uso futuro além do imóvel atual |
| Metragem/área | Texto ou número (m²) | — |
| Endereço | Texto | Endereço descritivo, exibido como texto simples |
| Link do Google Maps | URL | **Apenas o link deve ser exibido como botão/atalho** (ex: "Ver no mapa"), levando o usuário ao Google Maps em nova aba. **O mapa não deve ser incorporado (embed) visualmente na página** — apenas o link de redirecionamento |
| Lugares próximos | Texto livre ou lista de tags | Ex: "Supermercado, Academias, Escolas, Restaurantes, Praia (500m)" |
| Informações adicionais | Texto livre (área de texto maior, tipo descrição) | Espaço para detalhes como "terreno ideal para construção de prédio, escola, academia ou galpão, a critério do comprador" |
| Preço | Número/moeda (R$) | — |
| Fotos | Múltiplos arquivos de imagem | **Limite: até 50 fotos por imóvel** |
| Vídeos | Múltiplos arquivos de vídeo **ou** links externos | **Limite: até 2 vídeos por imóvel.** O admin deve poder escolher, para cada vídeo, entre fazer upload direto do arquivo **ou** colar um link externo (ex: YouTube) |

> ⚠️ Como nenhum campo é obrigatório, o layout de exibição do imóvel (Seção 6) precisa ser **inteiramente adaptativo**: uma seção sem conteúdo (ex: "Lugares próximos" vazio) simplesmente não deve ser renderizada — nunca exibir um bloco vazio, título sem conteúdo, ou espaço em branco quebrado.

---

## 5. IDENTIDADE VISUAL E CONTEÚDO INICIAL

- A **logo oficial da imobiliária** será enviada separadamente pelo cliente diretamente no Lovable — utilizá-la no cabeçalho e nos locais de marca do site (favicon, rodapé etc.), sem alterar suas cores originais.
- Estilo visual: **moderno, sofisticado, elegante e clássico ao mesmo tempo** — evitar excesso de elementos "gritantes"; priorizar tipografia limpa, espaçamento generoso, paleta neutra com um tom de destaque (a definir com base na logo, já que ela ainda será enviada — usar cores extraídas da logo como referência de paleta).
- **Contatos oficiais a cadastrar (editáveis pelo admin a qualquer momento — ver Seção 7):**
  - WhatsApp 1: `81 98849-0523`
  - WhatsApp 2: `81 98778-5590`
  - Instagram: `@f.terto.imoveis` → link: `https://www.instagram.com/f.terto.imoveis`
  - CRECI: `23228`
  - Nome do corretor: `Fernando Terto`

> ⚠️ **Atenção — decisão pendente sobre WhatsApp:** foram fornecidos dois números de WhatsApp. Como o botão de contato (Seção 8) abre uma conversa em **um único número por vez**, o painel admin deve ter um campo de configuração chamando **"Número de WhatsApp principal"**, permitindo ao admin escolher/trocar qual dos dois números recebe os contatos vindos do site, a qualquer momento — sem necessidade de mexer em código. Por padrão inicial, usar o primeiro número (`81 98849-0523`), mas deixar claramente editável.

### 5.1 Imóvel inicial (dado de exemplo real, a ser pré-cadastrado)
Cadastrar o seguinte imóvel como conteúdo inicial do site, deixando **todos os campos editáveis pelo admin** posteriormente:

- **Título:** Área com casa construída em Candeias *(sugestão de título livre — o admin pode renomear a qualquer momento)*
- **Status:** Disponível
- **Tipo de negociação:** Venda
- **Metragem:** 1.450 m²
- **Endereço:** Av. Ulisses Montarroyos, 5743 — Bairro de Candeias, Jaboatão dos Guararapes — PE (a 500 metros da praia)
- **Link do Google Maps:** `https://maps.app.goo.gl/kBp1o4RMjb2JnVRZ7`
- **Lugares próximos:** Supermercado, Academias, Escolas, Restaurantes
- **Informações adicionais:** Possui casa construída no terreno. Área com potencial ideal para construção de prédio, escola, academia ou galpão, a critério do comprador.
- **Preço:** *(não informado — deixar campo em branco para preenchimento posterior pelo admin)*
- **Fotos/vídeos:** *(nenhum enviado ainda — o admin fará o upload posteriormente pelo painel)*

---

## 6. LAYOUT E RESPONSIVIDADE (REQUISITO CRÍTICO)

Este é o requisito não-funcional mais importante do projeto — trate com máxima prioridade.

### 6.1 Adaptação a conteúdo variável
Como cada imóvel pode ter uma combinação diferente de campos preenchidos (um com vídeo e sem "lugares próximos", outro com todos os campos, outro só com preço e fotos), a página de detalhe do imóvel deve ser construída com um **sistema de blocos condicionais**: cada seção (galeria de fotos, vídeos, endereço/mapa, lugares próximos, informações adicionais, preço) só é renderizada se houver conteúdo para ela, e o layout deve se reorganizar de forma limpa e equilibrada independentemente de quantos blocos existem — sem espaços vazios, sem quebra visual, sem elementos "flutuando" desalinhados.

### 6.2 Responsividade extrema
- O layout deve funcionar de forma **confortável e sem quebra visual em qualquer tamanho de tela** — de smartphones pequenos a monitores ultrawide.
- Usar unidades e técnicas fluidas (CSS Grid/Flexbox com `minmax`, `clamp()` para tipografia fluida, breakpoints bem testados), evitando larguras fixas em pixels que causem overflow horizontal.
- Testar mentalmente/tecnicamente o comportamento em pelo menos estes breakpoints de referência: 360px (celular pequeno), 768px (tablet), 1024px (notebook), 1440px e 1920px (desktop grande).
- Galeria de fotos: usar um componente de carrossel/grid responsivo que se adapte ao número real de fotos enviadas (1 foto, 10 fotos ou 50 fotos devem ser exibidas de forma esteticamente equilibrada, sem grid quebrado).

### 6.3 Página inicial (Home)
- Grid de cards de imóveis, cada card mostrando: foto de capa, título, metragem (se houver), preço (se houver), status (badge "Disponível"/"Vendido").
- Igual ao restante do site: cards com dados ausentes não devem quebrar o layout (ex: card sem preço definido pode mostrar "Consulte o valor" em vez de campo vazio).

### 6.4 Tema claro/escuro e idiomas
- Implementar alternância entre **tema claro e escuro**, aplicada a todo o site de forma consistente.
- Implementar seletor de idioma **Português (BR), Inglês e Espanhol**, traduzindo todo o conteúdo textual fixo da interface (menus, botões, rótulos). Conteúdo dinâmico cadastrado pelo admin (título do imóvel, descrição etc.) pode permanecer no idioma em que foi digitado, a menos que o cliente solicite tradução automática futuramente — não implementar tradução automática de conteúdo dinâmico nesta fase.

### 6.5 Otimização de mídia
- Fotos: comprimir/otimizar automaticamente no upload (ex: conversão para WebP, redimensionamento para um tamanho máximo razoável de exibição web) para manter o site leve mesmo com até 50 fotos por imóvel.
- Vídeos: como o limite é de 2 por imóvel, ainda assim orientar visualmente o admin (texto de ajuda no painel) a preferir vídeos curtos e de tamanho controlado quando fizer upload direto, e oferecer a opção de link externo (YouTube) como alternativa mais leve para o site.

---

## 7. PAINEL ADMINISTRATIVO — FUNCIONALIDADES

O admin (assistente do corretor), após login, deve ter acesso a uma área de gerenciamento com as seguintes ações, disponíveis a qualquer momento, sem necessidade de suporte técnico:

1. **Adicionar novo imóvel** — formulário com todos os campos da Seção 4, nenhum obrigatório, podendo salvar com o mínimo de informação e completar depois.
2. **Editar imóvel existente** — alterar qualquer campo, a qualquer momento, incluindo adicionar/remover fotos e vídeos individualmente (não precisa reenviar tudo para adicionar uma foto nova).
3. **Excluir imóvel** — remoção completa do imóvel do site (com uma confirmação simples do tipo "Tem certeza?" para evitar exclusão acidental).
4. **Excluir dado específico** — remover uma foto, um vídeo ou o conteúdo de um campo específico sem precisar excluir o imóvel inteiro.
5. **Marcar como vendido / disponível** — alternância simples de status (ex: um botão/toggle), sem precisar excluir o imóvel (útil para manter histórico ou reativar caso a venda não se concretize).
6. **Editar dados de contato do site** — número de WhatsApp principal (ver Seção 5), Instagram, CRECI, nome do corretor — todos editáveis pelo painel, sem mexer em código.

**Requisito de usabilidade do painel:** como o usuário final desse painel é leigo em tecnologia, a interface administrativa deve ser tão simples e visual quanto o site público — formulários claros, botões com rótulos diretos ("Salvar", "Excluir imóvel", "Marcar como vendido"), sem jargão técnico, sem etapas desnecessárias.

---

## 8. FLUXO DE CONTATO VIA WHATSAPP

O botão de contato do site deve seguir a seguinte lógica:

### 8.1 Contato a partir de um imóvel específico
Ao clicar em "Falar com o corretor" dentro da página de um imóvel (ou selecionar um ou mais imóveis, caso o usuário esteja navegando em modo de seleção múltipla — ver 8.2), o WhatsApp deve abrir já com uma mensagem pré-preenchida mencionando o(s) imóvel(is) escolhido(s). Modelo de mensagem (usar como texto padrão, editável futuramente se o cliente quiser trocar):

> *"Olá! Vi o imóvel "[Título do Imóvel]" no site e gostaria de saber mais informações."*

Para seleção de múltiplos imóveis:
> *"Olá! Vi os imóveis "[Título 1]" e "[Título 2]" no site e gostaria de saber mais informações."*

### 8.2 Lista de seleção de imóvel(is) de interesse
Ao clicar no botão geral de "Falar com o corretor" (por exemplo, a partir do menu principal, sem estar necessariamente dentro da página de um imóvel específico), deve abrir uma lista/modal permitindo ao usuário:
- Selecionar um ou mais imóveis disponíveis no site sobre os quais deseja falar;
- Ou escolher a opção **"Apenas tirar dúvidas"**, para quando não quiser tratar de um imóvel específico.

### 8.3 Contato geral / "Apenas tirar dúvidas"
Quando o usuário escolher a opção "Apenas tirar dúvidas" (seja pela lista da Seção 8.2, seja a partir de uma eventual aba/seção de "Contato" do site), a mensagem pré-preenchida enviada ao WhatsApp deve ser:

> *"Olá! Vim através do site e gostaria de tirar algumas dúvidas."*

### 8.4 Implementação técnica
Usar o link padrão de WhatsApp Click-to-Chat (`https://wa.me/55[NÚMERO]?text=[MENSAGEM CODIFICADA EM URL]`), abrindo em nova aba, direcionando para o **número de WhatsApp principal** configurado pelo admin (Seção 5).

---

## 9. FLUXO DO USUÁRIO (RESUMO)

```
[Home] → [Ver lista de imóveis, com filtros básicos se fizer sentido: status, tipo]
   │
   ├── [Clicar em um imóvel] → [Página de detalhe: fotos, vídeos, metragem,
   │        endereço (com link para Google Maps), lugares próximos,
   │        informações adicionais, preço — apenas o que estiver preenchido]
   │              │
   │              └── [Botão "Falar com o corretor"] → WhatsApp com mensagem
   │                       pré-preenchida sobre este imóvel (Seção 8.1)
   │
   └── [Botão geral "Falar com o corretor" / aba de contato]
              └── [Lista de seleção de imóveis OU "Apenas tirar dúvidas"] (Seção 8.2)
                       └── WhatsApp com mensagem correspondente
```

---

## 10. FUNCIONALIDADES NÃO INCLUÍDAS NESTA FASE (confirmado com o cliente)

Para deixar claro o escopo e evitar desenvolvimento de itens não solicitados:
- **Sem cadastro/login de usuário visitante** (site 100% público para navegação).
- **Sem seção de "imóveis correlacionados/similares"** — o cliente confirmou que não deseja essa funcionalidade nesta fase.
- **Sem tradução automática de conteúdo dinâmico** cadastrado pelo admin (apenas a interface fixa é traduzida — ver Seção 6.4).
- **Sem mapa incorporado (embed)** — apenas link de redirecionamento ao Google Maps (Seção 4).

---

## 11. REGRAS ANTI-ALUCINAÇÃO E DE PRECISÃO (OBRIGATÓRIAS)

1. **Não inventar dados de contato, preços ou informações do imóvel** além dos fornecidos na Seção 5.1. Qualquer campo não informado (ex: preço do imóvel inicial) deve ficar vazio no sistema, nunca preenchido com um valor de exemplo apresentado como real.
2. **Não tornar nenhum campo do formulário de imóvel obrigatório** — este é um requisito explícito e crítico do cliente (Seção 4). Validações técnicas (ex: formato de URL válido em "Link do Google Maps") são aceitáveis, mas nunca exigir preenchimento.
3. **Não criar fluxo de cadastro público de usuário** em nenhuma hipótese — mesmo que pareça "mais completo" tecnicamente, isso contraria o modelo de acesso definido na Seção 2.
4. **Não incorporar o mapa visualmente na página** — apenas o link/botão de redirecionamento, conforme Seção 4.
5. **Respeitar rigorosamente os limites de mídia:** máximo de 50 fotos e 2 vídeos por imóvel — implementar validação no painel admin que impeça o envio além desses limites, com aviso claro ao usuário administrador.
6. **Não implementar a funcionalidade de "imóveis correlacionados"**, mesmo que seja uma prática comum de mercado — o cliente explicitamente pediu para não incluir nesta fase (Seção 10).
7. **Não presumir qual dos dois números de WhatsApp é o principal sem tornar isso configurável** — implementar exatamente como definido na Seção 5 (campo editável pelo admin).
8. Ao gerar qualquer texto de interface (botões, rótulos, mensagens do sistema) não especificado literalmente neste prompt, manter o tom **moderno, sofisticado e elegante** definido na Seção 5, evitando linguagem genérica de template ou excesso de emojis/informalidade.
9. Caso alguma decisão técnica de implementação (ex: biblioteca específica de carrossel de imagens) não esteja especificada aqui, a IA pode escolher a solução mais leve e compatível com a stack definida na Seção 3, mas deve deixar claro no resultado qual escolha fez e por quê, para validação posterior.

---

*Fim do prompt. Anexar a logo da imobiliária no Lovable ao iniciar a construção, conforme Seção 5.*

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d435e46b-4526-4ec1-9d24-32c0327db1e1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
