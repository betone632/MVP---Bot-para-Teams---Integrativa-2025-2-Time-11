Text file: config.js
Latest content with line numbers:
1	const config = {
2	  botId: process.env.BOT_ID,
3	  botPassword: process.env.BOT_PASSWORD,
4	  openAIKey: process.env.OPENAI_API_KEY,
5	  azureOpenAIKey: process.env.AZURE_OPENAI_API_KEY,
6	  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
7	};
8	
9	module.exports = config;
10	