let turnIndex = 0;
let board;

function setup() {
    createCanvas(
        Board.BOARD_WIDTH + PieceMenu.WIDTH,
        Board.BOARD_WIDTH
    );

    board = new Board();
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        board.selectNext(-1);
    } else if (keyCode === DOWN_ARROW) {
        board.selectNext(1);
    }

    if (key === "w") {
        board.move(-1, 0);
    } else if (key === "a") {
        board.move(0, -1);
    } else if (key === "s") {
        board.move(1, 0);
    } else if (key === "d") {
        board.move(0, 1);
    } else if (key === "z") {
        board.rotate(false);
    } else if (key === "c") {
        board.rotate(true);
    } else if (key === "x") {
        board.flip();
    }

    if (keyCode === 13) {
        if (board.place(turnIndex)) {
            turnIndex = (turnIndex + 1) % 4;
        }
    }
}

function draw() {
    background("#FFFFFF");
    board.draw(turnIndex);
}