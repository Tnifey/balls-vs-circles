import { BLACK, CheckCollisionCircleRec, DrawRectangle, DrawRectangleLines, DrawRectangleLinesEx, DrawRectangleRec, DrawRectangleRounded, DrawRectangleRoundedLines, DrawText, GetCollisionRec, Rectangle, Vector2Add } from "raylib";
import { BOARD, BOARD_HEIGHT, BOARD_WIDTH, DEBUG, RED, WHITE } from "./const";
import { Player } from "./player";

export class Enemy {
    public x: number = 0;
    public y: number = 0;
    public xsize = 20;
    public ysize = 20;
    public color = RED;

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
        DrawRectangleRec(this.rectangle, this.color);
        DrawRectangleLinesEx(this.rectangle, 1, BLACK);

        DEBUG && DrawText(`X:${this.x}\nY:${this.y}`, this.x + 4, this.y + 4, 14, WHITE); // Draw the coordinates
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
