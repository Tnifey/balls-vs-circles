import { Ball } from "./ball";
import { Enemy } from "./enemy";

class GameState {
    public static instance: GameState = new GameState();

    public score = 0;
    public level = 1;

    public balls: Ball[] = [];
    public ballCost = 10;

    public enemies: any[] = [];

    public range = 1;
    public rangeCost = 10;

    public speedCost = 10;

    constructor() {
        if (GameState.instance) return GameState.instance;
        GameState.instance = this;
    }

    toJSON() {
        return {
            score: this.score,
            range: this.range,
            ballCost: this.ballCost,
            rangeCost: this.rangeCost,
            speedCost: this.speedCost,
            balls: this.balls.map(ball => ball.toJSON()),
            enemies: this.enemies.map(enemy => enemy.toJSON()),
        };
    }

    load(json: any) {
        this.score = json.score;
        this.range = json.range;
        this.ballCost = json.ballCost;
        this.rangeCost = json.rangeCost;
        this.speedCost = json.speedCost;
        this.balls = json.balls.map(Ball.fromJSON);
        this.enemies = json.enemies.map(Enemy.fromJSON);
    }
}

export const State = new GameState();
