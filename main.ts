import { InitWindow, CloseWindow, WindowShouldClose, BeginDrawing, EndDrawing, ClearBackground, GetColor, DrawRectangle, GetFrameTime, SetWindowPosition, SetWindowMinSize, IsWindowResized, SetWindowSize } from 'raylib';
import { WINDOW_HEIGHT, WINDOW_WIDTH, BACKGROUND } from './const';
import { game, save } from './game';

InitWindow(WINDOW_WIDTH, WINDOW_HEIGHT, 'Hello, Seaman!');
SetWindowPosition(140, 100);
SetWindowMinSize(WINDOW_WIDTH, WINDOW_HEIGHT);

while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(BACKGROUND);

    game();

    if (IsWindowResized()) {
        SetWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    }

    EndDrawing();
}

CloseWindow();
