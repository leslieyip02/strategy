class Piece {
    static EMPTY = 0;

    constructor(grid) {
        this.grid = grid;
        this.width = grid[0].length * Board.CELL_WIDTH;
        this.height = grid.length * Board.CELL_WIDTH;
    }

    rotate(clockwise) {
        if (clockwise) {
            let tmp = [];
            for (let i = 0; i < this.grid[0].length; i++) {
                tmp.push([]); 
                for (let j = this.grid.length - 1; j >= 0; j--) {
                    tmp[i].push(this.grid[j][i]);
                }   
            }
            this.grid = tmp;
        } else {
            this.rotate(true);
            this.rotate(true);
            this.rotate(true);
        }
    }

    flip() {
        let tmp = [];
        for (let i = 0; i < this.grid.length; i++) {
            tmp.push([]);
            for (let j = this.grid[0].length - 1; j >= 0; j--) {
                tmp[i].push(this.grid[i][j]);
            }
        }
        this.grid = tmp;
    }

    draw(x, y, color, s = "#333333") {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] !== Piece.EMPTY) {
                    fill(color);
                    stroke(s);
                } else {
                    noFill();
                    noStroke();
                }
                square(x + j * Board.CELL_WIDTH, y + i * Board.CELL_WIDTH, Board.CELL_WIDTH);
            }
        }
    }

    copy() {
        let tmp = [];
        for (let i = 0; i < this.grid.length; i++) {
            tmp.push(Array.from(this.grid[i]));
        }
        return new Piece(tmp);
    }
}

class PieceMenu {
    static WIDTH = 400;

    constructor() {
        const SQUARE = new Piece([
            [1, 1],
            [1, 1],
        ]);
        const ONE_BY_ONE = new Piece([
            [1],
        ]);
        const ONE_BY_TWO = new Piece([
            [1, 1],
        ]);
        const ONE_BY_THREE = new Piece([
            [1, 1, 1],
        ]);
        const ONE_BY_FOUR = new Piece([
            [1, 1, 1, 1],
        ]);
        const ONE_BY_FIVE = new Piece([
            [1, 1, 1, 1, 1],
        ]);
        const TOILET_BOWL = new Piece([
            [0, 1, 1],
            [1, 1, 0],
            [0, 1, 0],
        ]);
        const W = new Piece([
            [0, 1, 1],
            [1, 1, 0],
            [1, 0, 0],
        ]);
        const BIG_L = new Piece([
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ]);
        const LIGHTNING = new Piece([
            [1, 1, 0, 0],
            [0, 1, 1, 1],
        ]);
        const LONG_L = new Piece([
            [1, 0, 0, 0],
            [1, 1, 1, 1],
        ]);
        const LOPSIDED_T = new Piece([
            [0, 1, 0, 0],
            [1, 1, 1, 1],
        ]);
        const SHORT_L = new Piece([
            [1, 0, 0],
            [1, 1, 1],
        ]);
        const VAPE = new Piece([
            [1, 1, 0],
            [1, 1, 1],
        ]);
        const TETRIS = new Piece([
            [0, 1, 0],
            [1, 1, 1],
        ]);
        const SMALL_S = new Piece([
            [1, 1, 0],
            [0, 1, 1],
        ]);
        const BIG_S = new Piece([
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]);
        const BIG_T = new Piece([
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
        ]);
        const SMALL_L = new Piece([
            [1, 0],
            [1, 1],
        ]);
        const PLUS = new Piece([
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ]);
        const C = new Piece([
            [1, 1, 1],
            [1, 0, 1],
        ]);

        this.pieces = [
            SQUARE,
            ONE_BY_ONE,
            ONE_BY_TWO,
            ONE_BY_THREE,
            ONE_BY_FOUR,
            ONE_BY_FIVE,
            W,
            BIG_L,
            BIG_S,
            BIG_T,
            C,
            PLUS,
            VAPE,
            LIGHTNING,
            LOPSIDED_T, 
            SMALL_S,
            SMALL_L,
            TETRIS,
            SHORT_L,
            LONG_L,
            TOILET_BOWL,
        ];
        this.displayPieces = this.pieces.map((piece) => piece.copy());
        this.selectedIndex = 0;
    }

    selectNext(offset) {
        this.selectedIndex = (this.selectedIndex + offset + this.pieces.length) % this.pieces.length;
    }

    consume(piece) {
        let index = this.pieces.indexOf(piece);
        this.pieces.splice(index, 1);
        this.displayPieces.splice(index, 1);
    }

    getCurrentPiece() {
        if (this.pieces.length > 0) {
            return this.pieces[this.selectedIndex];
        } else {
            return false;
        }
    }

    draw(turnIndex) {
        noStroke();
        fill("#EEEEEE");
        rect(Board.BOARD_WIDTH, 0, PieceMenu.WIDTH, Board.BOARD_WIDTH);
        textAlign(CENTER);
        fill("#000000");
        text("Pieces:", Board.BOARD_WIDTH, 16, PieceMenu.WIDTH);

        let offset = 64;
        this.displayPieces.forEach((piece, index) => {
            const c = color(Board.COLORS[turnIndex]);
            if (index !== this.selectedIndex) {
                c.setAlpha(125);
            }
            piece.draw(Board.BOARD_WIDTH + (PieceMenu.WIDTH - piece.width) / 2, offset, c);
            offset += piece.height + Board.CELL_WIDTH;
        });
    }
}
