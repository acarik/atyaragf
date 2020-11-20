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
    if (err) {
      helpers.error(err)
    } else {
      if (data.length == 0) {
        bot.sendMessage(msg.chat.id, "Bugün için yarış yok.")
      } else {
        bot.sendMessage(msg.chat.id, "Bugünün yarışları:")
        data.forEach(element => {
          bot.sendMessage(msg.chat.id, helpers.stylizeYaris(element))
        });
      }
    }
  });
})

bot.onText(/\/\d{8}_\d{1,2}/, (msg, match) => {
  // tek bir kosuya veya ata bakalim
  //delete first element
  let msgText = msg.text.substring(1);
  const fields = msgText.split('_')

  const day = fields[0];
  const parkurNum = fields[1];

  switch (fields.length) {
    case 2: // kosu
      db.getKosu(day, parseInt(parkurNum), function callback(err, data) {
        if (err){
          return helpers.error(err)
        }
        if (data.length == 0) {
          bot.sendMessage(msg.chat.id, "Bu koşuda at yok.")
        } else {
          bot.sendMessage(msg.chat.id, "Bu koşudaki atlar:")
          data.forEach(element => {
            bot.sendMessage(msg.chat.id, helpers.stylizeAt(element))
          });
        }
      })
      break;
    case 3: // kosudaki at
      break;
    default:
      illegalCodeError(msg)
      break;
  }
})

function illegalCodeError(msg){
  bot.sendMessage(msg.chat.id, "Yanlis giris.")
}

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