import { DrawRectangleLinesEx, DrawRectangleRec, DrawText, GetColor, MeasureText, Rectangle } from "raylib";
import { BOARD, BOARD_HEIGHT, BOARD_WIDTH, DEBUG, RED, WHITE } from "./const";

export class Enemy {
    public x: number = 0;
    public y: number = 0;
    public xsize = 38;
    public ysize = 24;
    public color = RED;
    public score = 1;

    constructor() {
        this.randomMove();
    }

    randomMove() {
        const rand = {
            x: Math.round(Math.random() * (BOARD_WIDTH - this.xsize)),
            y: Math.round(Math.random() * (BOARD_HEIGHT - this.ysize))
        };

        this.x = rand.x + BOARD.x;
        this.y = rand.y + BOARD.y;
    }

    draw() {
        DrawRectangleRec(this.rectangle, GetColor(0xFF000055));
        DrawRectangleLinesEx(this.rectangle, 2, RED);

        this.textInside(`${this.score}`);

        DEBUG && false && DrawText(`X:${this.x}\nY:${this.y}`, this.x + 4, this.y + 4, 14, WHITE);
    }

    textInside(message: string, size = 10) {
        const text = `${message}`;
        const textWidth = MeasureText(text, size);
        DrawText(text, this.x + (this.xsize / 2) - (textWidth / 2), this.y + this.ysize / 2 - (size / 2), size, WHITE);
    }

    get rectangle(): Rectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.xsize,
            height: this.ysize,
        };
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            xsize: this.xsize,
            ysize: this.ysize,
        };
    }

    static fromJSON(json: any): Enemy {
        const enemy = new Enemy();
        enemy.x = json.x;
        enemy.y = json.y;
        enemy.xsize = json.xsize;
        enemy.ysize = json.ysize;

        return enemy;
    }
}
