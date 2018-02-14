module.exports = {
    name: 'user-autocreate',
    permissionLevel: 1000,
    isCommand: false,
    onMessage: async ({ message, connection }) => {
        const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

        if (!user) {
            await connection.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", [
                message.author.id,
                0,
                0,
                new Date(),
                new Date(),
                new Date(),
            ]);

            const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);
        }
    },
};
