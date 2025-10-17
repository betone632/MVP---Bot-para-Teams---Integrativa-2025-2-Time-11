# Pesquisa sobre Microsoft Teams Toolkit e Microsoft Graph API

## Microsoft Teams Toolkit

O Microsoft Teams Toolkit (agora conhecido como Microsoft 365 Agents Toolkit) é uma extensão para Visual Studio Code e Visual Studio 2022 que simplifica o desenvolvimento e a implantação de aplicativos para o Microsoft Teams. Ele oferece:

- **Templates de projeto:** Facilita o início de novos projetos de aplicativos Teams.
- **Integração com Azure Functions:** Suporte para incluir código server-side em aplicativos Teams.
- **CLI (Command Line Interface):** Para acelerar o desenvolvimento de aplicativos Teams.
- **Gerenciamento de ambientes:** Suporte para diferentes ambientes de build e deploy (local, dev, etc.).

Ele é fundamental para a criação da extensão inteligente do Teams, fornecendo a estrutura e as ferramentas necessárias para construir, depurar e implantar o aplicativo.

## Microsoft Graph API para Transcrições e Metadados de Reuniões

A Microsoft Graph API é a porta de entrada para dados e inteligência do Microsoft 365. Para o nosso MVP, as seguintes APIs são de particular interesse para acessar transcrições e metadados de reuniões do Teams:

- **`GET /communications/callTranscripts/{id}`:** Permite a recuperação de transcrições de chamadas/reuniões. Suporta transcrições de reuniões de chat privadas e reuniões de canal.
  - [Documentação](https://learn.microsoft.com/en-us/graph/api/calltranscript-get?view=graph-rest-1.0)
- **`GET /me/onlineMeetings/{id}/transcripts` ou `GET /users/{id}/onlineMeetings/{id}/transcripts`:** Lista as transcrições disponíveis para uma reunião online específica.
  - [Documentação](https://learn.microsoft.com/en-us/graph/api/onlinemeeting-list-transcripts?view=graph-rest-1.0)
- **Notificações de mudança (Change Notifications):** É possível se inscrever para receber notificações quando uma transcrição ou gravação estiver disponível, o que é crucial para um fluxo de trabalho reativo.
  - [Documentação](https://learn.microsoft.com/en-us/graph/teams-changenotifications-callrecording-and-calltranscript)
- **Metadados de Reunião:** APIs como `GET /onlineMeetings/{id}` podem fornecer informações sobre a reunião, como participantes, hora de início/fim, etc.

## Teams Bot Framework

O Teams Bot Framework permite a criação de bots interativos para o Microsoft Teams. Para o MVP, ele será utilizado para:

- **Interação por chat:** Permitir que os usuários consultem o bot para resumos de reuniões ou decisões específicas.
- **Publicação de resumos:** O bot poderá publicar automaticamente os resumos estruturados das reuniões no chat do Teams.
- **Comandos:** Suportar comandos específicos para acionar funcionalidades do bot.

Um exemplo de bot que utiliza a Graph API para buscar transcrições e apresentá-las em um módulo de tarefas do Teams foi encontrado:
- [Exemplo de Meeting Transcript Bot (Node.js)](https://learn.microsoft.com/en-us/samples/officedev/microsoft-teams-samples/officedev-microsoft-teams-samples-meetings-transcription-nodejs/)

## Próximos Passos

Compreendendo as ferramentas e APIs, o próximo passo será configurar o ambiente de desenvolvimento e iniciar a estrutura base do projeto Teams, focando na integração inicial com o Teams Toolkit.
