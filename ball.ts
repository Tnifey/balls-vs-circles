import { BLACK, CheckCollisionCircleRec, ColorAlpha, DrawCircleLines, DrawCircleV, DrawLineEx, DrawLineV, DrawRectangleLinesEx, DrawText, GetCollisionRec, GetColor, GetFrameTime, Rectangle, Vector2, Vector2Add, Vector2Invert, } from "raylib";
import { BLUE, BOARD, BOARD_HEIGHT, BOARD_WIDTH, DEBUG, WHITE } from "./const";
import { Enemy } from "./enemy";

export class Ball {
    public x = 0;
    public y = 0;
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
        const rand: Vector2 = {
            x: Math.round(Math.random() * (BOARD_WIDTH - this.size)),
            y: Math.round(Math.random() * (BOARD_HEIGHT - this.size))
        };

        this.x = rand.x + BOARD.x;
        this.y = rand.y + BOARD.y;
    }

    draw() {
        DrawCircleV(this.position, this.size, this.color);
        const trail = Vector2Add(this.position, { x: this.size * -this.xdir, y: this.size * -this.ydir });
        const trail1 = Vector2Add(this.position, { x: (this.size * 1.5) * -this.xdir, y: (this.size * 1.5) * -this.ydir });
        const trail2 = Vector2Add(this.position, { x: (this.size * 2) * -this.xdir, y: (this.size * 2) * -this.ydir });
        DrawLineEx(this.position, trail, this.size * 2, ColorAlpha(BLUE, 0.2));
        DrawLineEx(this.position, trail1, this.size * 1.5, ColorAlpha(BLUE, 0.2));
        DrawLineEx(this.position, trail2, this.size, ColorAlpha(BLUE, 0.4));

        DrawCircleLines(this.x, this.y, this.size + 0.5, BLACK);

        if (DEBUG) {
            DrawText(`X:${this.x}\nY:${this.y}`, this.x + this.size + 2, this.y - this.size, 14, WHITE);
            DrawCircleV(this.position, 2, WHITE);
            DrawRectangleLinesEx(this.rectangle, 2, GetColor(0xFFFFFF33));
            DrawLineV(this.position, this.movement, WHITE);
        }
    }

    move() {
        const time = GetFrameTime();

        if (this.x + this.size > BOARD.x + BOARD.width || this.x < BOARD.x) {
            this.xdir *= -1;
        }

        if (this.y + this.size > BOARD.y + BOARD.height || this.y < BOARD.y) {
            this.ydir *= -1;
        }

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

        this.x += this.speed * this.xdir * time;
        this.y += this.speed * this.ydir * time;
    }

    collide(enemy: Enemy): boolean {
        const isCollided = CheckCollisionCircleRec(this.position, this.size, enemy.rectangle);
        const collision = GetCollisionRec(this.rectangle, enemy.rectangle);

        if (isCollided) {
            // if ball is inside the enemy rectangle, move the ball out
            if (collision.width < 0 && collision.height < 0) {
                this.x = enemy.x + enemy.xsize + this.size;
                this.y = enemy.y + enemy.ysize + this.size;
            }

            const dir: Vector2 = {
                x: Math.abs(collision.width) > Math.abs(collision.height) ? 1 : -1,
                y: Math.abs(collision.width) > Math.abs(collision.height) ? -1 : 1,
            };

            this.xdir *= dir.x;
            this.ydir *= dir.y;
        }

        return isCollided;
    }

    get position(): Vector2 {
        return { x: this.x, y: this.y };
    }

    get rectangle(): Rectangle {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2,
        };
    }

    get movement(): Vector2 {
        return {
            x: this.x + this.xdir * this.size,
            y: this.y + this.ydir * this.size,
        };
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

    static fromJSON(json: any): Ball {
        const player = new Ball();
        player.x = json.x;
        player.y = json.y;
        player.xdir = json.xdir;
        player.ydir = json.ydir;
        player.speed = json.speed;
        player.size = json.size;
        return player;
    }
}
