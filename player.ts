import { BLACK, CheckCollisionCircleRec, DrawCircle, DrawCircleLines, DrawRectangle, DrawText, GetCollisionRec, GetFrameTime, Vector2 } from "raylib";
import { BLUE, BOARD, BOARD_HEIGHT, BOARD_WIDTH, DEBUG, WHITE } from "./const";
import { Enemy } from "./enemy";

export class Player {
    public x: number = 0;
    public y: number = 0;
    public xdir = 1;
    public ydir = 1;
    public speed = 100;
    public size = 10;
    public color = BLUE;

    constructor() {
        this.xdir = Math.round(Math.random()) * 2 - 1;
        this.ydir = Math.round(Math.random()) * 2 - 1;
        this.randomMove();
    }

    randomMove() {
        const rand = {
            x: Math.round(Math.random() * (BOARD_WIDTH - this.size)),
            y: Math.round(Math.random() * (BOARD_HEIGHT - this.size))
        };

        this.x = rand.x + BOARD.x;
        this.y = rand.y + BOARD.y;
    }

    draw() {
        if (DEBUG) this.drawHitbox();
        DrawCircle(this.x, this.y, this.size, this.color);
        DrawCircleLines(this.x, this.y, this.size + 1, BLACK);
        if (DEBUG) DrawText(`X:${this.x}\nY:${this.y}`, this.x + 4, this.y + 4, 14, WHITE);
    }

    move() {
        const time = GetFrameTime();

        // check if the player is inside the board
        if (this.x + this.size > BOARD.x + BOARD.width || this.x < BOARD.x) {
            this.xdir *= -1; // Reverse direction on x-axis
        }

        if (this.y + this.size > BOARD.y + BOARD.height || this.y < BOARD.y) {
            this.ydir *= -1; // Reverse direction on y-axis
        }

        // if player is outside the board, move it back inside
        if (this.x + this.size > BOARD.x + BOARD.width) {
            this.x = BOARD.x + BOARD.width - this.size;
        } else if (this.x < BOARD.x) {
            this.x = BOARD.x;
        }
        if (this.y + this.size > BOARD.y + BOARD.height) {
            this.y = BOARD.y + BOARD.height - this.size;
        } else if (this.y < BOARD.y) {
            this.y = BOARD.y;
        }

        // Update the position of the rectangle
        this.x += this.speed * this.xdir * time;
        this.y += this.speed * this.ydir * time;
    }

    collide(enemy: Enemy): boolean {
        const isCollided = CheckCollisionCircleRec(this.vector2, this.size, enemy.rectangle);
        const collision = GetCollisionRec(this.rectangle, enemy.rectangle);

        if (isCollided) {
            // if player is inside the enemy rectangle, move the player out
            if (collision.width < 0 && collision.height < 0) {
                this.x = enemy.x + enemy.xsize + this.size;
                this.y = enemy.y + enemy.ysize + this.size;
            }

            const dir = {
                x: Math.abs(collision.width) > Math.abs(collision.height) ? 1 : -1,
                y: Math.abs(collision.width) > Math.abs(collision.height) ? -1 : 1,
            };

            this.xdir *= dir.x;
            this.ydir *= dir.y;
        }

        return isCollided;
    }

    get vector2(): Vector2 {
        return {
            x: this.x,
            y: this.y,
        };
    }

    get rectangle() {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2,
        };
    }

    drawHitbox() {
        const { x, y, width, height } = this.rectangle;
        DrawRectangle(x, y, width, height, BLUE);
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            xdir: this.xdir,
            ydir: this.ydir,
            speed: this.speed,
            size: this.size,
        };
    }

    static fromJSON(json: any): Player {
        const player = new Player();
        player.x = json.x;
        player.y = json.y;
        player.xdir = json.xdir;
        player.ydir = json.ydir;
        player.speed = json.speed;
        player.size = json.size;
        return player;
    }
}
