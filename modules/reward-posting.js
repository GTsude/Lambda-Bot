module.exports = {
    name: 'reward-posting',
    onMessageReactionAdd: ({messageReaction, user}) => {
        console.log(messageReaction, user);
    }
};
