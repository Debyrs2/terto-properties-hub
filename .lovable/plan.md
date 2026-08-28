# Site Fernando Terto Imóveis

Site público de imóveis + painel administrativo de conta única, com backend Lovable Cloud (banco, login e armazenamento de mídia já incluídos, sem contas externas).

Observação de stack: o projeto roda em React + TanStack Start (Vite), o padrão atual do Lovable — equivalente ao React+Vite pedido, com a vantagem de SSR para SEO. Deploy/publicação sai pela Lovable (domínio próprio ou custom); GitHub/Vercel continuam possíveis via sincronização.

## Identidade visual

Logo enviada usada no cabeçalho, rodapé e favicon, sem alterar cores. Paleta neutra (grafite/off-white) com azul ciano da logo como tom de destaque, tipografia limpa, espaçamento amplo, tema claro/escuro.

## Páginas públicas

- **Home** — hero com marca, grid responsivo de cards (capa, título, metragem, preço ou "Consulte o valor", badge Disponível/Vendido), filtros simples por status e tipo de negociação.
- **Imóvel** — blocos condicionais: galeria (carrossel + lightbox, adaptando-se de 1 a 50 fotos), vídeos (upload ou YouTube, até 2), metragem, endereço, botão "Ver no mapa" (link externo, sem embed), lugares próximos, informações adicionais, preço, botão "Falar com o corretor". Blocos sem conteúdo não são renderizados.
- **Contato** — dados oficiais e botão "Apenas tirar dúvidas".
- **Rodapé** — nome do corretor, CRECI 23228, Instagram, WhatsApp. Sem qualquer link para o admin.

Responsividade fluida (grid com minmax, clamp() na tipografia), verificada em 360/768/1024/1440/1920.

## Idiomas e tema

Seletor PT-BR / EN / ES traduzindo toda a interface fixa (conteúdo cadastrado permanece como digitado) e alternância claro/escuro, ambos persistidos no navegador.

## WhatsApp

Links wa.me em nova aba, sempre para o "número principal" configurado no painel (padrão 81 98849-0523).
- No imóvel: `Olá! Vi o imóvel "[Título]" no site e gostaria de saber mais informações.`
- Botão geral: modal com lista de imóveis (seleção múltipla) ou "Apenas tirar dúvidas".
- Múltiplos: `Olá! Vi os imóveis "[T1]" e "[T2]" ...`
- Dúvidas: `Olá! Vim através do site e gostaria de tirar algumas dúvidas.`

## Painel administrativo (/admin)

Rota discreta, sem link em nenhum lugar público. Apenas tela de login por e-mail/senha — nenhum cadastro, nenhuma recuperação pública. A conta única será criada manualmente por mim no backend e a credencial repassada a você.

Funções: criar imóvel (nenhum campo obrigatório), editar qualquer campo, adicionar/remover fotos e vídeos individualmente, limpar campos isolados, excluir imóvel com confirmação, alternar Disponível/Vendido, e editar contatos do site (WhatsApp principal entre os dois números, Instagram, CRECI, nome). Linguagem simples, sem jargão. Validação de limite: 50 fotos e 2 vídeos por imóvel, com aviso claro.

## Conteúdo inicial

O imóvel de Candeias cadastrado exatamente com os dados fornecidos; preço em branco; sem fotos/vídeos.

## Detalhes técnicos

- Tabelas: `properties` (todos os campos opcionais), `property_media` (tipo foto/vídeo, url ou link externo, ordem), `site_settings` (linha única de contatos). Leitura pública liberada; escrita apenas para a conta autenticada, via políticas de segurança.
- Storage: bucket público `property-media`; imagens comprimidas e convertidas para WebP no navegador antes do upload (redimensionamento máx. ~1920px); lazy loading em imagens e vídeos, `preload="none"` e vídeos externos carregados só ao clicar.
- Carrossel: implementação com `embla-carousel-react` (já presente no ecossistema shadcn, muito leve) em vez de bibliotecas pesadas de galeria.
- i18n: dicionário próprio em contexto React (sem dependência extra), evitando peso desnecessário.

## Fora de escopo (confirmado)

Sem cadastro de visitante, sem imóveis similares, sem tradução automática de conteúdo, sem mapa incorporado.
