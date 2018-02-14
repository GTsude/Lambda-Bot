module.exports = <IMod> {
    name: 'sql',
    match: /^(sql)\ (.+)/gi,
    nearmatch: /^(sql)/gi,
    usage: 'sql <query>',
    permissionLevel: 1000,
    run: ({message, matches, connection}) => {
        connection.query(matches[2], (err, rows) => {
            if (err) message.channel.send(`\`\`\`fix\n${err.toString()}\`\`\``);
            else message.channel.send(`\`\`\`json\n${JSON.stringify(rows)}\`\`\``);
        });
    },
};
