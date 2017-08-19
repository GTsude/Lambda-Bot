const R = require("ramda");

const chooseOption = options => {
    console.log(options);
    const items = options.split(',').map(R.trim);
    console.log(items);
    return items[Math.floor(Math.random() * items.length)];
};

module.exports = {
    name: 'choose',
    match: /^(choose)\ (.+)/gi,
    usage: 'choose option1,option2,...',
    help: 'Simply seperate your possible options using commas and you\'ll get back one of them! Good luck!',
    description: 'For those occasions where you can\'t make a simple decision on your own..',
    run: async({message, matches}) => {
        console.log('choosing....');
        message.channel.send(chooseOption(matches[2]));
    }
};
