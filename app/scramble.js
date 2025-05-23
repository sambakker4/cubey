function generateScramble(length, kind) {
    const scrambleTypes = new Map();
    scrambleTypes.set("3x3", generate3x3);

    return scrambleTypes.get(kind)(length);
}

function generate3x3(length) {
    let moves = ["L", "R", "U", "D", "B", "F"];
    let scramble = [];

    for (let i = 0; i < length; i++) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        if (i != 0) {
            while (move == scramble[i - 1]) {
                move = moves[Math.floor(Math.random() * moves.length)];
            }
        }
        scramble.push(move);
    }

    let returnScramble = "";
    let additions = ["'", "2", ""]

    for (let move of scramble) {
        returnScramble += (move + additions[Math.floor(Math.random() * additions.length)] + " ");
    }
    return returnScramble;
}

export { generateScramble }
