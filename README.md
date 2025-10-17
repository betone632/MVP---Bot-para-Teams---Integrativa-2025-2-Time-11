# Meeting Summary Bot para Microsoft Teams

## Visão Geral do MVP

Este MVP (Produto Mínimo Viável) é uma extensão inteligente para o Microsoft Teams, desenvolvida para aprimorar a rastreabilidade e clareza das decisões tomadas em reuniões. Ele atua diretamente sobre as transcrições geradas automaticamente pelo Teams, utilizando inteligência artificial para identificar, analisar e sintetizar informações-chave, como decisões, responsáveis e prazos. O objetivo é reduzir reuniões repetidas e aumentar a clareza pós-reunião, proporcionando um resumo estruturado e um log rastreável de decisões.

## Arquitetura

A arquitetura do MVP é composta pelos seguintes componentes:

1.  **Microsoft Teams Toolkit:** Utilizado para o desenvolvimento e implantação da extensão do Teams, fornecendo a estrutura e as ferramentas necessárias para a criação do bot.
2.  **Teams Bot Framework:** Permite a interação natural com os usuários através de chat, comandos e mensagens automáticas no Teams.
3.  **Microsoft Graph API:** Acessa as transcrições e metadados das reuniões do Teams. Especificamente, as APIs de `onlineMeetings` e `callTranscripts` são usadas para recuperar o conteúdo das transcrições.
4.  **Modelo de IA (Manus via OpenAIModel):** Integrado ao bot para interpretar a linguagem natural das transcrições e extrair decisões, responsáveis e próximos passos. O modelo é configurado para gerar um resumo estruturado.
5.  **Interface Web para Log de Decisões:** Uma interface web simples para visualizar e filtrar um log rastreável das decisões, permitindo buscas por participante, data e projeto.

```mermaid
graph TD
    User[Usuário do Teams] -->|Interage com| TeamsBot[Teams Bot]
    TeamsBot -->|Solicita transcrição| MicrosoftGraphAPI[Microsoft Graph API]
    MicrosoftGraphAPI -->|Retorna transcrição da reunião| TeamsBot
    TeamsBot -->|Envia transcrição para análise| AIModel[Modelo de IA (Manus)]
    AIModel -->|Retorna resumo estruturado| TeamsBot
    TeamsBot -->|Publica resumo no chat do Teams| TeamsChat[Chat do Teams]
    TeamsBot -->|Armazena decisões em| DecisionLog[Log de Decisões (simulado/armazenamento futuro)]
    User -->|Acessa| WebInterface[Interface Web de Log de Decisões]
    WebInterface -->|Exibe| DecisionLog
```

## Funcionalidades do MVP

-   **Extração de Decisões:** Identifica automaticamente as decisões tomadas durante a reunião a partir da transcrição.
-   **Atribuição de Responsáveis:** Associa os responsáveis a cada decisão ou próximo passo.
-   **Definição de Prazos:** Extrai prazos relevantes para os próximos passos.
-   **Resumo Estruturado:** Gera um resumo da reunião no formato "O que foi decidido", "Quem é responsável" e "O que precisa ser feito até quando".
-   **Publicação Automática:** O resumo é publicado no chat da reunião do Teams.
-   **Log Rastreável de Decisões:** Uma interface web permite a visualização e filtragem das decisões por participante, data e projeto.

## Configuração do Ambiente de Desenvolvimento

1.  **Node.js:** Certifique-se de ter o Node.js (versão 16 ou 18 recomendada pelo Teams Toolkit, embora a v22.13.0 tenha sido usada neste ambiente) instalado.
2.  **Teams Toolkit CLI:** Instale o CLI globalmente:
    ```bash
    npm install -g @microsoft/teamsfx-cli
    ```
3.  **Criar Projeto:** Utilize o Teams Toolkit CLI para criar um novo projeto de bot, selecionando a opção `AI Chat Bot` e `JavaScript` como linguagem.
    ```bash
    teamsfx new --interactive
    ```
    -   Selecione `Bot`.
    -   Selecione `AI Chat Bot`.
    -   Selecione `JavaScript`.
    -   Defina o diretório do projeto (ex: `./`).
    -   Defina o nome do aplicativo (ex: `MeetingSummaryBot`).
4.  **Instalar Dependências:** Navegue até o diretório do projeto e instale as dependências:
    ```bash
    cd MeetingSummaryBot
    npm install
    npm install @microsoft/microsoft-graph-client @azure/identity isomorphic-fetch
    ```

## Configuração do Microsoft Graph API

Para acessar as transcrições de reuniões, seu aplicativo precisará das permissões apropriadas no Microsoft Graph. As permissões necessárias são `OnlineMeetings.Read.All` e `Calls.Read.All`. Estas permissões devem ser concedidas ao aplicativo no Azure Active Directory (AAD).

## Configuração do Modelo de IA

O bot está configurado para usar um modelo de IA compatível com a API OpenAI (neste caso, o modelo Manus `gemini-2.5-flash`). As chaves de API e o endpoint devem ser configurados como variáveis de ambiente:

-   `OPENAI_API_KEY`: Sua chave de API para o serviço OpenAI/Manus.
-   `OPENAI_API_BASE`: O endpoint da API (se diferente do padrão OpenAI).

## Uso do Bot

Após a implantação e configuração, o bot pode ser invocado no Microsoft Teams:

1.  **No chat de uma reunião:** Digite `@MeetingSummaryBot resumir reunião` para que o bot busque a transcrição da reunião atual, analise-a e publique um resumo estruturado no chat.
2.  **Interface Web:** Acesse a interface web (que será servida em uma URL específica após a implantação) para visualizar o log de decisões e aplicar filtros por participante, data e projeto.

## Estrutura do Projeto

```
MeetingSummaryBot/
├── src/
│   ├── app.js             # Lógica principal do bot, integração com Graph API e IA
│   ├── config.js          # Configurações do bot
│   ├── index.js           # Ponto de entrada do servidor, rotas
│   └── prompts/
│       ├── chat/          # Prompt padrão do chat
│       └── meetingSummary/  # Prompt para resumo de reuniões
│           ├── config.json
│           └── skprompt.txt
├── web/
│   ├── index.html         # Interface web para log de decisões
│   ├── styles.css         # Estilos da interface web
│   └── script.js          # Lógica da interface web (dados mockados)
├── package.json
├── teamsapp.yml
└── ... (outros arquivos gerados pelo Teams Toolkit)
```

## Próximos Passos e Melhorias Futuras

-   **Persistência de Dados:** Implementar um banco de dados (Azure Cosmos DB, SQL Azure, etc.) para armazenar os resumos e decisões de forma persistente, substituindo os dados mockados da interface web.
-   **Autenticação de Usuário:** Implementar autenticação de usuário para o acesso à Graph API, garantindo que o bot opere no contexto do usuário que o invoca ou com permissões de aplicativo mais granulares.
-   **Processamento Assíncrono:** Para reuniões longas, o processamento da transcrição e da IA pode levar tempo. Implementar um mecanismo assíncrono (ex: Azure Functions, filas de mensagens) para evitar timeouts e fornecer feedback ao usuário.
-   **Interface de Configuração:** Desenvolver uma interface para que os administradores possam configurar as permissões da Graph API e as chaves do modelo de IA de forma mais amigável.
-   **Refinamento do Prompt de IA:** Otimizar o prompt de IA para melhorar a precisão na extração de decisões, responsáveis e prazos, além de lidar com diferentes formatos de transcrição.
-   **Integração com Gerenciadores de Tarefas:** Integrar as decisões e próximos passos com ferramentas de gerenciamento de tarefas (ex: Microsoft Planner, Azure DevOps) para automação do fluxo de trabalho.
-   **Notificações Proativas:** Implementar notificações proativas do bot para lembrar responsáveis sobre prazos iminidos.

## Implantação

O Teams Toolkit facilita a implantação para o Azure. Utilize os comandos `teamsfx deploy` e `teamsfx publish` após configurar as variáveis de ambiente necessárias para o Azure. Consulte a documentação oficial do Teams Toolkit para detalhes sobre o processo de implantação.
