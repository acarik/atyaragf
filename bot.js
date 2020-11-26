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

bot.onText(/\/\d{8}_\d{0,2}/, (msg, match) => {
  // tek bir kosuya veya ata bakalim
  //delete first element
  let msgText = msg.text.substring(1);
  const fields = msgText.split('_')

  const day = fields[0];
  const parkurNumStr = fields[1];
  const parkurNum = parseInt(parkurNumStr);
  const ayakNumStr = fields[2];
  const ayakNum = parseInt(ayakNumStr);
  const atNumStr = fields[3];
  const atNum = parseInt(atNumStr);

  switch (fields.length) {
    case 1: //gun. "/20112020" gibi bir sorgu gelmis. o gunku yarislari dondurelim
      db.getParkurlar(day, function callback(err, data) {
        if (err) {
          return helpers.error(err)
        }
        if (data.length == 0) {
          bot.sendMessage(msg.chat.id, "Bu gün koşu yok.")
        } else {
          bot.sendMessage(msg.chat.id, day + " için koşulan parkurlar:");
          data.forEach(element => {
            bot.sendMessage(msg.chat.id,
              "/" + day + '_' + parkurNumStr + (day + " " + helpers.parkurStr(parkurNum)))
          })
        }
      })
    case 2: // parkur. "/20112020_3" gibi bir sorgu gelmis. o parkurdaki ayaklari dondurelim
      db.getAyaklar(day, parseInt(parkurNumStr), function callback(err, data) {
        if (err) {
          return helpers.error(err)
        }
        if (data.length == 0) {
          bot.sendMessage(msg.chat.id, "Bu parkurda ayak yok.")
        } else {
          bot.sendMessage(msg.chat.id, day + " " + helpers.parkurStr(parkurNumStr) + " için ayaklar:");
          data.forEach(element => {
            bot.sendMessage(msg.chat.id,
              "/" + day + '_' + parkurNumStr + '_' + element + " " + (day + " " + helpers.parkurStr(parkurNum) + " " + element + ". Ayak"))
          })
        }
      })
    case 3: // parkur kosu. "/20112020_3_1" gibi bir sorgu gelmis
      db.getKosuAtlar(day, parkurNum, ayakNum, function callback(err, data) {
        if (err) {
          return helpers.error(err)
        }
        if (data.length == 0) {
          bot.sendMessage(msg.chat.id, "Bu koşuda at yok.")
        } else {
          bot.sendMessage(msg.chat.id, day + " " + helpers.parkurStr(parkurNum) + " " + ayakNumStr + ". Ayak koşusundaki atlar:")
          data.forEach(element => {
            bot.sendMessage(msg.chat.id,
              "/" + day + '_' + parkurNumStr + '_' + ayakNumStr + "_" + element + " " + (day + " " + helpers.parkurStr(parkurNum) + " " + ayakNumStr + ". Ayak, " + element + ". At"))
          });
        }
      })
      break;
    case 4: // kosudaki at
      db.getAt(day, parkurNum, ayakNum, atNum, function callback(err, data) {
        if (err) {
          return helpers.error(err)
        }
        if (data.length == 0) {
          bot.sendMessage(msg.chat.id, "Bu ata dair kayıt yok.")
        } else {
          //bot.sendMessage(msg.chat.id, day + " " + helpers.parkurStr(parkurNum) + " " + ayakNumStr + ". Ayak koşusundaki atlar:")
          bot.sendMessage(msg.chat.id,
            data.length + " tane kayit var.")
        }
      })
      break;
    default:
      illegalCodeError(msg)
      break;
  }
})

function illegalCodeError(msg) {
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