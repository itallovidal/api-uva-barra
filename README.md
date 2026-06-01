# Agência UVA Barra

> Backend da Migração do site da Agência Experimental de Notícias UVA Barra de WordPress para uma stack moderna, com foco em performance, manutenibilidade e documentação consistente.

---

## Sobre o Projeto

A **Agência UVA Barra** é uma agência experimental de notícias da Universidade Veiga de Almeida, campus Barra da Tijuca (RJ). Fundada em **16 de novembro de 2016**, atende aos cursos de **Jornalismo** e **Publicidade**, funcionando como laboratório de prática profissional para os alunos.

Este repositório contém o **replatforming completo** do site agenciauvabarra.com, saindo do WordPress e adotando tecnologias modernas com melhor performance, experiência de desenvolvimento e escalabilidade.

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js `>= 20`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/api-uva-barra.git
cd site-uva-barra

# Instale as dependências
npm install  # ou pnpm / yarn

# Inicie o ambiente de desenvolvimento
npm run dev
```

---

## Como Contribuir

Muito importante que leia as convencões adotadas em `CODING-RULES.MD` para que seu PR seja aprovado.

1. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit suas mudanças: `git commit -m "feat: descrição da feature"`
4. Abra um **Pull Request** descrevendo o que foi feito

Siga o padrão Conventional Commits. Iremos verificar as mudanças e em breve ela estará no ar!

---

## Categories

Categories are intentionally minimal in this codebase:

- `POST /categories` creates a category with `name`
- `GET /categories` lists all categories
- `DELETE /categories/:id` deletes a category by id

---

## Links

- Site atual: agenciauvabarra.com
- Universidade Veiga de Almeida: uva.br
