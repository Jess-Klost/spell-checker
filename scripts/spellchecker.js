

class SpellChecker {
	constructor()  {
		// Load dictionary from file into array
		const url = "data/dictionary.txt";
		try {
			const response = Promise.all([
				fetch(url).then(x => x.text())
			]).then(([dict]) => {
				this.dict = dict.split("\r\n");
			});	
		}
		catch (error) {
			console.error(error.message);
		}
	}
	
	spellCheck(text) {
		return text;
	}	
}

const sc = new SpellChecker();
