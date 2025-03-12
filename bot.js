// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});
// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Mapa para rastrear o estado de cada conversa
const userStates = {};

client.on('message', async msg => {

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|agendar|agendamento|tudo|bem)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(2000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await msg.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await client.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da FotoImob!🤖📸 \nComo posso ajudá-lo hoje?\nPor favor, digite uma das opções abaixo:\n\n1 - Agendamento\n2 - Falar com atendente`);


        // Definindo o estado inicial do usuário como "aguardando escolha"
        userStates[msg.from] = { stage: 'aguardando_escolha' };
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, ' Para realizarmos o seu agendamento, preciso que me envie algumas informações, ok?');

        await delay(2000); //delay de 2 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000);
        await client.sendMessage(msg.from, '\n 👱‍♂️ 👩‍🦳Nome do corretor:\n📎Imobiliaria:\n🏡Tipo de Imóvel:\n📍Endereço:\n📐Tamanho do imóvel(IPTU):\n🪑Vazio ou Ocupado/Mobiliado:\n💡Tem Luz no imóvel:\n👩‍💼🧑‍💼CORRETOR(A) IRÁ ACOMPANHAR:');

        // Atualizando o estado do usuário para "aguardando_informacoes"
        userStates[msg.from] = { stage: 'aguardando_informacoes' };
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(1000); //Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000);
        await client.sendMessage(msg.from, 'Aguarde um momento que já iremos atender você!');
        
        // Atualizando o estado para "aguardando_atendente"
        userStates[msg.from] = { stage: 'aguardando_atendente' };
    }

    // Verifica se o usuário está no estágio 'aguardando_informacoes' e enviou algum dado
    if (userStates[msg.from] && userStates[msg.from].stage === 'aguardando_informacoes' && msg.body !== '1' && msg.body !== '2') {
        const chat = await msg.getChat();
        
        // Envia mensagem de agradecimento após o cliente enviar as informações
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000);
        
        await client.sendMessage(msg.from, 'Obrigado pelas informações! 🙏🏼 Em breve, entraremos em contato com a data do agendamento. Fique atento! 📅📲');

        // Atualizando o estado para "finalizado"
        userStates[msg.from] = { stage: 'finalizado' };
    }
});
