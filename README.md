# App

GymPass style app.

## RFs

 - [x] Deve ser possível se cadastrar
 - [] Deve ser possível se autenticar
 - [] Deve ser possível obter o perfil de um usuário logado
 - [] Deve ser possível obter um número de check-ins 
 realizados pelo usuário logado
 - [] Deve ser possível o usuário obter seu histórico de check-ins
 - [] Deve ser possível o usuário buscar academias próximas
 - [] Deve ser possível buscar academias pelo nome
 - [x] Deve ser possível o usuário realizar check-in em uma academia
 - [] Deve ser possível validar o check-in de um usuário
 - [] Deve ser possível cadastrar uma academia 

## RNs

- [x] O usuário não poder se cadastrar com um e-mail duplicado
- [x] O usuário não pode fazer dois check-ins no mesmo dia
- [] O usuário não pode fazer check-in se não estiver a, no mínimo, 100 metros da academia
- [] O check-in só pode ser validado após 20 após ser criado
- [] O check-in só pode ser validado por administradores
- [] A academia só pode se cadastrada por administradores

## RNFs

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [] Todas as listas de dados precisam estar paginadas com 20 itens por páginas
- [] O usuário deve ser identificado por um JWT 