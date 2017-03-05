class Actions {
    constructor(hook) {
        this.hook = hook;
    }

    send({ sessionId }, { text }) {
        const recipientId = this.hook.sessions[sessionId].fbid;
        if (recipientId) {
            return this.hook.fbMessage(recipientId, text)
                .then(() => null)
                .catch((err) => {
                    console.error(
                        'Oops! An error occurred while forwarding the response to',
                        recipientId,
                        ':',
                        err.stack || err
                    );
                });
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            return Promise.resolve();
        }
    }

    emotionUpdate(context) {
        return Promise.resolve();
    }
}

module.exports = Actions