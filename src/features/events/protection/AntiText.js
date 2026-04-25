"use strict";

module.exports.config = {
    name: "antiText",
    eventTypes: ["message", "message_reaction"],
};

module.exports.execute = async function ({ api, event, config }) {
    const { threadID, senderID, body, attachments, reaction, userID } = event;

    const uid = senderID || userID;

    // ======================
    // ADMIN CHECK (SAFE)
    // ======================
    const admins = config.bot.admins || [];
    const superAdmins = config.bot.superAdmins || [];

    if (admins.includes(uid) || superAdmins.includes(uid)) {
        return; // ✅ admin safe (hindi ma-kick)
    }

    // ======================
    // ALLOW PHOTO & VIDEO ONLY
    // ======================
    if (attachments && attachments.length > 0) {
        const type = attachments[0].type;

        if (type === "photo" || type === "video") {
            return; // ✅ allow media
        }
    }

    // ======================
    // BLOCK ALL TEXT
    // ======================
    if (body) {
        try {
            await api.gcmember("remove", senderID, threadID);
        } catch (e) {}
        return;
    }

    // ======================
    // BLOCK LIKE REACTION
    // ======================
    if (reaction === "👍") {
        try {
            await api.gcmember("remove", uid, threadID);
        } catch (e) {}
        return;
    }
};
