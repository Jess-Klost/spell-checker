// Returns true if c is a vowel
function isVowel(c) {
	c = c.toLowerCase();
	return /[aeiou]/i.test(c);
}

// Returns the optimal alignment value between 2 strings using sequence 
// alignment
function seqAlign(s1, s2) {
	// Penalties for mismatches and gaps
	const penalty = {
		match: 0,
		mismatchSame: 1, // vowel/vowel or consonant/consonant mismatch
		mismatchDiff: 3, // vowel/consonant mismatch
		gap: 2
	};
	
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	let table = [];
	let currMismatch = 0; // Penalty for taking current char instead of gap
	
	// Set up table
	for (let row = 0; row < s1.length + 1; row++) {
		table[row] = [];
	}

	table[0][0] = 0;
	for (let row = 1; row < s1.length + 1; row++) {
		table[row][0] = table[row - 1][0] + penalty.gap;	
	}
	for (let col = 1; col < s2.length + 1; col++) {
		table[0][col] = table[0][col - 1] + penalty.gap;	
	}	
	
	for (let row = 1; row < s1.length + 1; row++) {
		for (let col = 1; col < s2.length + 1; col++) {
			if (s1[row-1] == s2[col-1]) {
				currMismatch = penalty.match;
			}
			else if (isVowel(s1[row-1]) == isVowel(s2[col-1])) {
				currMismatch = penalty.mismatchSame;
			}
			else {
				currMismatch = penalty.mismatchDiff;
			}

			table[row][col] = 
				Math.min(
				currMismatch + table[row - 1][col - 1],
				penalty.gap + table[row - 1][col],
				penalty.gap + table[row][col - 1]);
		}
	}

	return table[s1.length][s2.length];
}

// Object that can hold a word and its sequence alignment relative to another
// word
function WordAlign(word, align) {
	this.word = word;
	this.align = align;
}

// Compare function for sorting an array of WordAligns in ascending order
// by align value
function compareWordAlign(a, b) {
	if (a.align < b.align) {
		return -1;
	}
	else if (a.align > b.align) {
		return 1;
	}
	return 0;
}

// Adds elements of array as list items to element with id listId
// Note: array should only contain WordAlign objects
function listWordAlignArray(listId, array) {
	let listItemsString = "";
	for (const element of array) {
		listItemsString += `<li>${element.word} (${element.align})</li>\n`;
	}
	document.getElementById(listId).innerHTML = listItemsString;
}

// Class for spell checking against a specific dictionary file
class SpellChecker {
	constructor(dictionaryUrl)  {
		// Load dictionary from file into array
		try {
			const response = Promise.all([
				fetch(dictionaryUrl).then(x => x.text())
			]).then(([dict]) => {
				this.dict = dict.split("\r\n");
			});	
		}
		catch (error) {
			console.error(error.message);
		}
	}
	
	// Returns array of WordAligns of size topAmount with the top matching
	// words from the specified dictionary using sequence alignment
	spellCheck(word, topAmount) {
		let alignVals = []
		for (let i = 0; i < this.dict.length; i++) {
			alignVals[i] = new WordAlign(this.dict[i],
				seqAlign(word, this.dict[i]));
		}
		alignVals = alignVals.sort(compareWordAlign);
		return alignVals.slice(0, topAmount);
	}
}

const sc = new SpellChecker("data/dictionary.txt");
