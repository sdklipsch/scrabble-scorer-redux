const input = require('readline-sync');

const oldPointStructure = {
	1: ['A', 'E', 'I', 'O', 'U', 'L', 'N', 'R', 'S', 'T'],
	2: ['D', 'G'],
	3: ['B', 'C', 'M', 'P'],
	4: ['F', 'H', 'V', 'W', 'Y'],
	5: ['K'],
	8: ['J', 'X'],
	10: ['Q', 'Z'],
};

function oldScrabbleScorer(word) {
	word = word.toUpperCase();
	let letterPoints = '';

	for (let i = 0; i < word.length; i++) {
		for (const pointValue in oldPointStructure) {
			if (oldPointStructure[pointValue].includes(word[i])) {
				letterPoints += `Points for '${word[i]}': ${pointValue}\n`;
			}
		}
	}
	return letterPoints;
}

/* 
    See README for full instructions and project requirements.
*/

function transformScrabblePointStructure() {
    let newStructure = {};

    for (let pointValue in oldPointStructure) {
        let letterArray = oldPointStructure[pointValue]
        for (let letter of letterArray) {
            newStructure[letter.toLowerCase()] = Number(pointValue);
        }
    }
    return newStructure;
}

const newPointStructure = transformScrabblePointStructure();

/** SIMPLE SCORER **/

const simpleScorer = word => word.length;

/** VOWEL BONUS SCORER **/

const vowelBonusScorer = word => {
    let vowels = 'aeiou';
    let score = 0;

    for (let letter of word) {
        if (vowels.includes(letter.toLowerCase())) {
            score += 3;
        } else {
            score += 1;
        }
    }
    return score;
}

/** NEW SCRABBLE SCORER **/

const newScrabbleScorer = word => {
    let score = 0;
    for (let letter of word) {
        score += newPointStructure[letter.toLowerCase()];
    }
    return score;
}

/** DATA STRUCTURE TO FACILITATE GAMEPLAY **/

const scoringModes = [
    {
        name: 'Simple',
        description: 'Each letter is worth one point.',
        scoreWord: simpleScorer,
    },
    {
        name: 'Bonus Vowels',
        description: 'Vowels are 3 points, consonants are 1 point',
        scoreWord: vowelBonusScorer,
    },
    {
        name: 'Scrabble',
        description: 'Triditional Scrabble points.',
        scoreWord: newScrabbleScorer,
    },
]

/** USER INPUT VALIDATION HELPER FUNCTIONS (ADD WHEN NEEDED) **/

function isValidIndex(index, array) {
    index = Number(index.trim());
    return !isNaN(index) && index >= 0 && index < array.length;
}

function isValidWord(word) {
    const allowed = 'abcdefghijklmnopqrstuvwxyz';
    word = word.trim().toLowerCase();
    for (let letter of word) {
        if (!allowed.includes(letter)) return false;
    }
    return true;
}

function shouldQuit(word) {
    return word.toUpperCase().trim() === 'QUIT';
}

function shouldSwitchMode(word) {
    return word.toUpperCase().trim() === 'SWITCH';
}

function shouldDisplayInstructions(word) {
    return word.toUpperCase().trim() === 'HELP';
}

/** TASK-BASED HELPER FUNCTIONS */

function displayInstructions() {
    console.log('\nSelect from one of the three scoring modes:');
    for (let mode of scoringModes) {
        console.log(`   ${mode.name}:${mode.description}`)
    }
    console.log(`
You may enter any word as long as it contains only alphabetical characters.
    - Enter 'QUIT' instead to end the program.
    - Enter 'SWITCH' to switch scoring modes.
    - Enter 'HELP' to view instructinos again.
          
Have fun!`)
}

function getScoringModeFromUser() {
    console.log('\nWhich scoring mode would you like to use?');
    let optionsText = '';
    for(let i=0; i < scoringModes.length; i++) {
        let option = scoringModes[i];
        optionsText += `\n${i} - ${option.name}: ${option.description}`;
    }
    let selection = input.question(optionsText + "\n\nEnter a number: ");
    while(!isValidIndex(selection, scoringModes)) {
        selection = input.question("\n\nPlease enter a valid number from the options presented: ");
    }
    return scoringModes[selection];
}

function getWordFromUser() {
    let word = input.question('\nEnter a word to score: \n');
    if (!isValidWord(word)) {
        word = input.question('\nInvalid word. \nPlease enter a word with no spaces, numbers, symbols, or punctuation. \n');
    }
    return word;
}

/*
    This is the primary function that will run the entire program. 
    Make use of helper functions to define reusable subroutines.
    Design control flow mechanisms to meet requirements for program lifecycle.
*/

function runProgram() {
	console.log('\nWELCOME TO SCRABBLE SCORER!');

	displayInstructions();
    
	let scorerObj;
    let word;
	do {
        scorerObj = getScoringModeFromUser();
        while (true) {
            word = getWordFromUser();
            if(shouldDisplayInstructions(word)) displayInstructions();
            else {
                let score = scorerObj.scoreWord(word);
                console.log(`\nScore for ${word}: ${score}`)
            }
            if (shouldQuit(word) || shouldSwitchMode(word)) break;
        }
    } while(!shouldQuit(word));

    console.log('\n\nThank you for playing!')
}

// TODO #7B: Call the primary function to run its code block
runProgram();
