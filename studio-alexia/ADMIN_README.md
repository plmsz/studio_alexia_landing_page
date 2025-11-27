# Sistema de Gerenciamento de Serviços - Studio Alexia

## Instruções para Executar

Para executar o sistema completo, você precisa rodar **2 terminais simultaneamente**:

### Terminal 1 - JSON Server (API Backend)
```bash
cd studio-alexia
npm run json-server
```
Isso iniciará o json-server na porta **3001** (`http://localhost:3001`)

### Terminal 2 - React App (Frontend)
```bash
cd studio-alexia
npm run dev
```
Isso iniciará a aplicação React na porta **5173** (`http://localhost:5173`)

## Acessando o Sistema

- **Site Principal**: `http://localhost:5173`
- **Dashboard Admin**: `http://localhost:5173/admin`
- **API JSON Server**: `http://localhost:3001/services`

## Funcionalidades do Dashboard

No dashboard `/admin`, você pode:

1. **Visualizar todos os serviços** em uma tabela
2. **Adicionar novo serviço** - Clique em "+ Adicionar Serviço"
3. **Editar serviço** - Clique no botão "Editar" de qualquer serviço
4. **Deletar serviço** - Clique no botão "Deletar" (com confirmação)
5. **Marcar como destacado** - Use o checkbox "Destacar na página inicial" para controlar quais serviços aparecem na home

## Estrutura dos Dados

Cada serviço possui:
- **id**: Número único (gerado automaticamente)
- **title**: Título do serviço
- **description**: Descrição detalhada
- **image**: Caminho da imagem (selecionado de imagens existentes)
- **imageAlt**: Texto alternativo da imagem
- **featured**: Boolean - se true, aparece na página inicial

## Upload de Imagens

O sistema permite upload real de imagens com as seguintes características:

### Especificações
- **Formatos aceitos**: JPG, JPEG, PNG, WebP
- **Tamanho máximo**: 2MB
- **Redimensionamento automático**: Se a imagem exceder 2MB, será automaticamente redimensionada
- **Armazenamento**: Base64 no db.json

### Como usar
1. **Clique ou arraste** uma imagem para a área de upload
2. Aguarde o processamento (se necessário, será redimensionada)
3. Visualize o preview da imagem
4. Preencha os demais campos e salve

### Imagens Existentes
As 11 imagens originais já foram convertidas para base64 e estão no db.json

## Banco de Dados

O banco de dados é o arquivo `db.json` na raiz do projeto. As alterações são salvas automaticamente neste arquivo pelo json-server.

## Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite** (Build tool)
- **React Router** (Navegação)
- **Axios** (HTTP Client)
- **JSON Server** (Mock API)
- **CSS Modules** (Estilização)
