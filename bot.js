const params = require('./params.json')
const TelegramBot = require('node-telegram-bot-api');
const db = require('./db.js')
const helpers = require("./helper-functions.js");
const { parkurStr } = require('./helper-functions.js');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(params.token, { polling: true });

bot.onText(/\/help/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "/start yazarak bugünün yarışlarına bakabilirsin.")
})

bot.onText(/\/start/, (msg, match) => {
  // bugunun yarislarina bakalim
  db.getParkursToday(function callback(err, data) {
    if (err){
      helpers.error(err)
    }else{
      bot.sendMessage(msg.chat.id, "Bugunun yarislari:" + data)
    }
  });
  //const parkurs = db.getParkursToday();
})

/*
bot.onText(/\/deleteAll/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "deleting all");
  db.deleteAll();
});

bot.onText(/\/getAll/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "getting all");
  db.getAll();
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
*/