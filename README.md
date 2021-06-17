# Dev.Finance$ - maratona_discover

Controle de lançamento de despesas e receitas
=================

<!--ts-->
   * [Sobre](#Sobre)
   * [Como usar](#Como-usar)
      * [Pré Requisitos](#Pré-requisitos)
      * [Lançamentos](#Lançamentos)
      * [Editar](#Editar)
      * [Multiplos lancamentos](#Multiplos-lançamentos)
      * [Filtros](#Filtros)
      * [Exportar](#Exportar)
      * [Gráficos](#Gráficos)
   * [Tecnologias](#Tecnologias)
   
   * [Autor](#Autor)
<!--te-->

* [Link de acesso ao sistema pelo deploy](https://diegohfcelestino.github.io/maratona_discover/)

# Sobre
Projeto para administração financeira pessoal, desenvolvido durante a **Maratona Discover** pelo **Mayk Brito** da **Rocket Seat**.

Programa criado para lançamentos de despesas e receitas, também foi implementado três graficos para melhor analisar as despesas e receitas, sendo que o terceiro gráfico altera quando a carteira está saudável ou quando está  em risco, informando o usuário qual o valor de entrada, saída e total.

Foi adicionado a opção de lançamento parcelado, onde o usuário consegue lançar varias parcelas em um unico momento, podendo fazer filtros na tela e exportar em arquivo de texto.

# Como usar

## Pré requisitos
Com apenas o navegador é possivél utilizar o sistema de controle despesas/receitas.

## Lançamentos
Clicar no link **+ Nova Transação** vai abrir um modal onde o usuário deverá informar a descrição da receita ou despesa, valor (sempre usar o sinal negativo quando se tratrar de despesa e colocar a virgula para separar os centavos, informar a data e clicar em salvar.

## Editar
Clicar no botão editar, o sistema já vai abrir o modal onde será possivel editar descrião da despesa ou receita, valor e até data, apos alterar basta clicar em salvar.

## Multiplos lançamentos
Clicar no link **+ Nova Transação Parcelada** é possivel fazer lançamentos parcelados de uma unica vez, onde devemos informar descrição da receita ou despesa, no campo parcelas temos que informar a quantidade de parcelas que queremos lançar, o valor e a data (no campo data , quando se tratar do dia 31 o sistema vai alterar para dia 30 quando se trata de meses com 30 dias e para 28 quando se tratar de fevereiro.

## Filtros
Clicando na opção de filtros podemos fazer filtros por datas e aumentar ou diminuir a quantidade de lançamentos por páginas (fica por padrão a quantidade de 15 itens por pagina).

## Exportar
Clicando no botão **Gerar extrato** consegue-se fazer o download do arquivo de texto com as transações lançadas no sistema.

## Gráficos
O sistema possui três gráficos para melhor análise do usuário

No primeiro gráfico é listado as cinco maiores receitas, no segundo as cinco maiores despesas. Já no terceiro gráfico é possivel saber se mantem uma carteira saudável ou em risco onde o gráfico mostrará as entradas, as saídas e o valor líquido infomrando se está em risco ou se está saudável.


# Tecnologias

* [CSS](https://github.com/diegohfcelestino/maratona_discover/blob/master/style.css)
* [HTML](https://github.com/diegohfcelestino/maratona_discover/blob/master/index.html)
* [JavaScript](https://github.com/diegohfcelestino/maratona_discover/blob/master/scripts.js) 


# Autor
Feito com amor e dedicação por **Diego Henrique Ferreira** Entre em contato!

[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=link_do_seu_perfil_no_github)](https://github.com/diegohfcelestino)
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/diego-ferreira-34b6348b/)](https://www.linkedin.com/in/diego-ferreira-34b6348b/)
[![Whatsapp Badge](https://img.shields.io/badge/-Whatsapp-4CA143?style=flat-square&labelColor=4CA143&logo=whatsapp&logoColor=white&link=https://api.whatsapp.com/send?phone=+5516991187434&text=Hello!)](https://api.whatsapp.com/send?phone=+5516991187434&text=Hello!)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:diegohfcelestino@gmail.com)](mailto:diegohfcelestino@gmail.com)





