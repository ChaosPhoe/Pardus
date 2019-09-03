class Command {
	constructor(bot, data) {
		this.bot = bot;
		this.name = data.name;
		this.aliases = data.aliases || [];
		this.category = data.category || "Main";
		this.usage = data.usage || this.name;
		this.description = data.description;
		this.example = data.example;
	}
}
module.exports = Command;