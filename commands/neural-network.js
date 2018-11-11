module.exports = {
    "name": "check",
    "dm": false,
    "args": false,
    "usage": "<args>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "You can check if the tweet if from Trump or Kim Kardashian.",
  execute(message, args, level) {
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()

net.train([
  { input: "Inside Chi's nursery", output: "kardashian" },
  { input: "Why I dyed my hair pink", output: "kardashian" },
  { input: "Feeling Blue (wearing @kkwbeauty powder contour in medium & dark contour kit as eye shadow, & a new lip coming soon)", output: "kardashian" },
  { input: "I will be interviewed by @JudgeJeanine on @FoxNews at 9:00 P.M. Enjoy!", output: "trump" },
  { input: "Dem Memo: FBI did not disclose who the clients were - the Clinton Campaign and the DNC. Wow!", output: "trump" },
  { input: "Thank you to the great men and women of the United States @SecretService for a job well done!", output: "trump" }
])
  const output = net.run("I dyed my hair")
   console.log(output)
    message.channel.send(output)

 
 /*let trainedNet;

function encode(arg) {
   return args.map(x => (x.charCodeAt(0) / 255));
}

function processTrainingData(data) {
   return data.map(d => {
       return {
           input: encode(d.input),
           output: d.output
       }
   })
}

function train(data) {
   let net = new brain.NeuralNetwork();
   net.train(processTrainingData(data));
   trainedNet = net.toFunction();
   console.log('Finished training...');
};

function execute(input) {
   let results = trainedNet(encode(args));
   let output;
   results.trump > results.kardashian ? output = 'Trump' : output = 'Kardashian';
   return output;
}

train(trainingData);
    message.channel.send(execute("These aren't real. Kanye would never write Yeezy on the side"))
    console.log(execute("These aren't real. Kanye would never write Yeezy on the side"))*/
  }
}