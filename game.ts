import { CheckCollisionCircleRec, DrawText, GetMousePosition, IsMouseButtonPressed, MOUSE_BUTTON_LEFT, GuiButton, DrawRectangleLines, DrawRectangle, MOUSE_BUTTON_RIGHT, DrawCircleLines, BLUE, GuiDisable, GuiEnable, GuiLine, GetKeyPressed, KEY_ONE, KEY_THREE, KEY_TWO } from "raylib";
import { Enemy } from "./enemy";
import { Ball } from "./ball";
import { BOARD, DARK, DEBUG, INIT_PAUSE, RED, SAVE_FILE, WHITE, WINDOW_HEIGHT, WINDOW_WIDTH } from "./const";

let score = 0;
let ballCost = 100;
let range = 1;
let rangeCost = 100;
let speedCost = 10;
let pause = INIT_PAUSE;
let level = 1;

export let balls = Array(2).fill(0).map(() => new Ball());
export let enemies: Enemy[] = Array(20).fill(0).map(() => new Enemy());

await load();

function removeEnemy(enemy: Enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) enemies.splice(index, 1);
}

export function game() {
    if (enemies.length <= 0) {
        enemies = Array(20).fill(0).map(() => new Enemy());
        score += level * 10;
        level += 1;
        save();
    }

    const mousePos = GetMousePosition();

    if (IsMouseButtonPressed(MOUSE_BUTTON_RIGHT)) {
        pause = !pause;
    }

    DrawRectangle(BOARD.x, BOARD.y, BOARD.width, BOARD.height, DARK);

    if (DEBUG) {
        DrawRectangleLines(BOARD.x, BOARD.y, BOARD.width, BOARD.height, WHITE);
        DrawRectangleLines(BOARD.x, BOARD.y, BOARD.width - enemies[0].xsize, BOARD.height - enemies[0].ysize, RED);
    }

    if (!pause && IsMouseButtonPressed(MOUSE_BUTTON_LEFT)) {
        for (let enemy of enemies) {
            if (CheckCollisionCircleRec(mousePos, range, enemy.rectangle)) {
                removeEnemy(enemy);
                score += 1;
            }
        }
    }

    if (!pause) {
        for (let enemy of enemies) {
            for (let ball of balls) {
                if (ball.collide(enemy)) {
                    removeEnemy(enemy);
                    score += 1;
                }
            }
        }
    }

    for (let ball of balls) {
        if (!pause) ball.move();
        ball.draw();
    }

    for (let enemy of enemies) {
        enemy.draw();
    }

    if (CheckCollisionCircleRec(mousePos, 1, BOARD)) {
        DrawCircleLines(mousePos.x, mousePos.y, range, BLUE);
    }

    DrawText([
        `Balls: ${balls.length}`,
        `Enemies: ${enemies.length}`,
        `Range: ${range}`,
        `Speed: ${balls[0].speed}`,
        `\nLevel: ${level}`,
        `Score: ${score}`
    ].join('   '), 10, 10, 18, WHITE);
    GuiLine({ x: 0, y: BOARD.y - 5, width: BOARD.width, height: 10 }, `Stats`);

    shop();

    GuiEnable();
    if (GuiButton({ x: WINDOW_WIDTH - 10 - 100, y: 10, width: 100, height: 40 }, `save`)) save();

    if (DEBUG && GuiButton({ x: WINDOW_WIDTH - 10 - 100, y: WINDOW_HEIGHT - 50, width: 100, height: 40 }, `score`)) {
        score += 1000000;
    }
}

export function shop() {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonPadding = 10;
    const buttons = [
        {
            label: `+1 ball\n($${ballCost})`,
            disabled: score < ballCost,
            shortcut: KEY_ONE,
            action: () => {
                const ball = new Ball();
                ball.speed = balls[0].speed;
                balls.push(ball);
                score -= Math.max(0, ballCost);
                ballCost += Math.round(rangeCost / range * 0.5);
            }
        },
        {
            label: `+1 range\n($${rangeCost})`,
            disabled: score < rangeCost,
            shortcut: KEY_TWO,
            action: () => {
                score -= Math.max(0, rangeCost);
                rangeCost += Math.round(rangeCost / range * 0.5);
                range += 1;
            }
        },
        {
            label: `+10 speed\n($${speedCost})`,
            disabled: score < speedCost,
            shortcut: KEY_THREE,
            action: () => {
                score -= Math.max(0, speedCost);
                speedCost += 10;
                for (let ball of balls) {
                    ball.speed += 10;
                }
            }
        }
    ];

    GuiLine({ x: 0, y: (BOARD.height + BOARD.y - 5), width: BOARD.width, height: 10 }, `Shop`);

    const pressed = GetKeyPressed();

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const x = buttonPadding + (buttonWidth + buttonPadding) * i;
        const y = WINDOW_HEIGHT - buttonHeight - buttonPadding;
        if (button.disabled) GuiDisable(); else GuiEnable();
        if (GuiButton({ x, y, width: buttonWidth, height: buttonHeight }, button.label) || (!button.disabled && pressed === button.shortcut)) {
            button.action();
            save();
            GuiEnable();
        }
    }
}

export async function save() {
    const gameState = { score, ballCost, range, rangeCost, speedCost, balls, enemies, level };
    await Bun.file(SAVE_FILE).write(JSON.stringify(gameState));
    // console.log('Game state saved:', gameState);
}

export async function load() {
    const state = Bun.file(SAVE_FILE);
    if (!(await state.exists())) return;

    const gameState = await state.json();
    level = gameState.level ?? level;
    score = gameState.score ?? score;
    ballCost = gameState.ballCost ?? ballCost;
    range = gameState.range ?? range;
    rangeCost = gameState.rangeCost ?? rangeCost;
    speedCost = gameState.speedCost ?? speedCost;
    balls = gameState.balls?.map((ball => Ball.fromJSON(ball))) ?? balls;
    enemies = gameState.enemies?.map((enemy => Enemy.fromJSON(enemy))) ?? enemies;

}
