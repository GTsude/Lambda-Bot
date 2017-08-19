const R = require("ramda");

const chooseOption = options => {const items = options.split(',').map(R.trim); // Converts param options to array items
    return items[Math.floor(Math.random() * items.length)]; // Returns a random item
};

module.exports = {
    name: 'choose',
    match: /^(choose)\ (.+)/gi,
    usage: 'choose option1,option2,...',
    help: 'For those occasions where you can\'t make a simple decision on your own..',
    run: async({message, matches}) => {
        console.log('choosing....');
        message.channel.send(chooseOption(matches[2])); // Call chooseOption with param matches[2]
    }
};
