/* eslint-disable require-atomic-updates */
"use strict";
const CTemp = require("../base/Command");
const { ErrorMsg, findRole, findChannel } = require("../functions");
const GuildSetup = require("../models/guildSettings");
class Setup extends CTemp {
	constructor(bot) {
		super(bot, {
			name: "setup",
			category:"Moderation",
			description:"Use this command to setup your bot!",
			example:"!setup",
			usage:"!setup",
		});
	}
	async run(message, args) {
		if(!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return ErrorMsg(this.bot, message, "You need the permission: Manage Server to execute this command!");
		const guild = await GuildSetup.findOne({ guildID: message.guild.id });
		if(!args[0]) return message.channel.send(this.bot.setupEmbed);
		if(!["autorole", "staffrole", "welcomemessage", "leavemessage", "staffrole", "prefix"].includes(args[0].toLowerCase())) return message.channel.send(this.bot.setupEmbed);
		let toSetup = args[0].toLowerCase();
		if(toSetup === "welcomemessage") {
			if(!args[1]) return ErrorMsg(this.bot, message, "You need to provide a channel!");
			const channel = findChannel(message.mentions.channels.first() || args[1]);
			if(!channel) return ErrorMsg(this.bot, message, "Couldn't find that channel!");
			guild.welcomeChannel = channel.id;
			if(!args[2]) return;
			guild.welcomeMessage = args.slice(2).join(" ");
		}
		else if(toSetup === "leavemessage") {
			if(!args[1]) return ErrorMsg(this.bot, message, "You need to provide a channel!");
			const channel = findChannel(message.mentions.channels.first() || args[1]);
			if(!channel) return ErrorMsg(this.bot, message, "Couldn't find that channel!");
			guild.leaveChannel = channel.id;
			if(!args[2]) return;
			guild.leaveMessage = args.slice(2).join(" ");
		}
		else if(toSetup === "autorole") {
			if(!args[1]) return ErrorMsg(this.bot, message, "Do you want to Remove or Add one?");
			if(!args[2]) return ErrorMsg(this.bot, message, "You need to mention the role or provide the role id/name");
			const role = findRole(message, args.slice(2).join(" "));
			if(!role) return ErrorMsg(this.bot, message, "Couldn't find that role!");
			if(args[1].toLowerCase() === "remove") {
				if(!guild.autoroles.includes(role.id)) return ErrorMsg(this.bot, message, "That role isn't set up as an auto role!");
				guild.autoroles = guild.autoroles.join(" ").replace(role.id, "").split(" ");
				guild.save().catch();
				message.reply("Successfully removed the role!");
			}
			if(args[1].toLowerCase() === "add") {
				if(guild.autoroles.includes(role.id)) return ErrorMsg(this.bot, message, "That role is already added as a Auto Role!");
				guild.autoroles = [...guild.autoroles, role.id];
				guild.save().catch(console.error);
				message.reply("Successfully added the role!");

			}
		}
		else if(toSetup === "staffrole") {
			if(!args[1]) return ErrorMsg(this.bot, message, "Do you want to Remove or Add one?");
			if(!args[2]) return ErrorMsg(this.bot, message, "You need to mention the role or provide the role id/name");
			const role = findRole(message, args.slice(2).join(" "));
			if(!role) return ErrorMsg(this.bot, message, "Couldn't find that role!");
			if(args[1].toLowerCase() === "remove") {
				if(!guild.staffRoles.includes(role.id)) return ErrorMsg(this.bot, message, "That role isn't set up as a staff role!");
				guild.staffRoles = guild.staffRoles.join(" ").replace(role.id, "").split(" ");
				guild.save().catch();
				message.reply("Successfully removed the role!");
			}
			if(args[1].toLowerCase() === "add") {
				if(guild.staffRoles.includes(role.id)) return ErrorMsg(this.bot, message, "That role is already added as a Staff Role!");
				guild.staffRoles = [...guild.staffRoles, role.id];
				guild.save().catch(console.error);
				message.reply("Successfully added the role!");
			}
		}
		else{
			message.channel.send(this.bot.setupEmbed);
		}
	}
}
module.exports = Setup;
