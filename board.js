class Board {
    static EMPTY = -1;
    static WIDTH = 20;
    static CELL_WIDTH = 32;
    static COLORS = ["#3581D8", "#D82E3F", "#FFF44F", "#28CC2D"];
    static BOARD_WIDTH = Board.CELL_WIDTH * Board.WIDTH;

    constructor() {
        this.grid = [];
        for (let i = 0; i < Board.WIDTH; i++) {
            let row = [];
            for (let j = 0; j < Board.WIDTH; j++) {
                row.push(Board.EMPTY);
            }
            this.grid.push(row);
        }

        this.pieceMenus = [];
        for (let i = 0; i < Board.COLORS.length; i++) {
            this.pieceMenus.push(new PieceMenu());
        }
        this.turnIndex = 0;
        this.pieceMenu = this.pieceMenus[this.turnIndex];

        this.currentRow = 0;
        this.currentColumn = 0;
    }

    selectNext(offset) {
        this.pieceMenu.selectNext(offset);
    }

    move(row, column) {
        this.currentRow += row;
        this.currentColumn += column;

        // check OOB
        let currentPiece = this.pieceMenu.getCurrentPiece();
        if (!currentPiece) {
            return false;
        }
        if (this.currentRow < 0 || this.currentColumn < 0 ||
            this.currentRow + currentPiece.grid.length > Board.WIDTH ||
            this.currentColumn + currentPiece.grid[0].length > Board.WIDTH) {
            this.currentRow -= row
            this.currentColumn -= column;
        }
    }

    isValid(turnIndex) {
        let currentPiece = this.pieceMenu.getCurrentPiece();
        if (!currentPiece) {
            return false;
        }

        let isConnected = false;
        for (let i = 0; i < currentPiece.grid.length; i++) {
            for (let j = 0; j < currentPiece.grid[0].length; j++) {
                if (currentPiece.grid[i][j] !== Piece.EMPTY) {
                    // check overlap
                    if (this.grid[this.currentRow + i][this.currentColumn + j] !== Board.EMPTY) {
                        return false;
                    }

                    // check if edges are touching
                    for (let offsets of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                        let row = this.currentRow + i + offsets[0];
                        let column = this.currentColumn + j + offsets[1];
                        if (row < 0 || column < 0 || row > Board.WIDTH || column > Board.WIDTH) {
                            continue;
                        }

                        if (this.grid[row] !== undefined && this.grid[row][column] === turnIndex) {
                            return false;
                        }
                    }

                    // check adjacent corners
                    for (let offsets of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
                        let row = this.currentRow + i + offsets[0];
                        let column = this.currentColumn + j + offsets[1];
                        if (row < 0 || column < 0 || row > Board.WIDTH || column > Board.WIDTH) {
                            continue;
                        }

                        if (this.grid[row] !== undefined && this.grid[row][column] === turnIndex) {
                            isConnected = true;
                            break;
                        }
                    }
                }
            }   
        }

        // check if corner
        let sidesTouching = 0;
        if (this.currentRow === 0) {
            sidesTouching++;
        }
        if (this.currentColumn === 0) {
            sidesTouching++;
        }
        if (this.currentRow + currentPiece.grid.length === Board.WIDTH) {
            sidesTouching++;
        }
        if (this.currentColumn + currentPiece.grid[0].length === Board.WIDTH) {
            sidesTouching++;
        }
        if (sidesTouching === 2) {
            isConnected = true;
        }
        return isConnected;
    }

    rotate(clockwise) {
        let currentPiece = this.pieceMenu.getCurrentPiece();
        if (!currentPiece) {
            return false;
        }
        currentPiece.rotate(clockwise);
    }
    
    flip() {
        let currentPiece = this.pieceMenu.getCurrentPiece();
        if (!currentPiece) {
            return false;
        }
        currentPiece.flip();
    }

    place(turnIndex) {
        if (!this.isValid(turnIndex)) {
            return false;
        }

        let currentPiece = this.pieceMenu.getCurrentPiece();
        if (!currentPiece) {
            return false;
        }
        for (let i = 0; i < currentPiece.grid.length; i++) {
            for (let j = 0; j < currentPiece.grid[i].length; j++) {
                if (currentPiece.grid[i][j] !== Piece.EMPTY) {
                    this.grid[this.currentRow + i][this.currentColumn + j] = turnIndex;
                }
            }   
        }
        this.pieceMenu.consume(currentPiece);
        this.turnIndex = (this.turnIndex + 1) % Board.COLORS.length;
        this.pieceMenu = this.pieceMenus[this.turnIndex];
        return true;
    }

    draw(turnIndex) {
        stroke("#333333");
        for (let i = 0; i < Board.WIDTH; i++) {
            for (let j = 0; j < Board.WIDTH; j++) {
                fill(
                    this.grid[i][j] !== Board.EMPTY 
                        ? Board.COLORS[this.grid[i][j]]
                        : "#FFFFFF"
                );
                square(j * Board.CELL_WIDTH, i * Board.CELL_WIDTH, Board.CELL_WIDTH);
            }
        }

        this.pieceMenu.draw(turnIndex);

        let selectedPiece = this.pieceMenu.getCurrentPiece();
        if (!selectedPiece) {
            return;
        }
        const c = color(Board.COLORS[turnIndex]);
        c.setAlpha(125);
        const s = this.isValid(turnIndex) ? "#333333" : "#FF0000";
        selectedPiece.draw(this.currentColumn * Board.CELL_WIDTH, this.currentRow * Board.CELL_WIDTH, c, s);
    }
}