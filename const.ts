import { GetColor, Rectangle } from "raylib";

export const DEBUG = false;
export const WINDOW_WIDTH = 800;
export const WINDOW_HEIGHT = 600;

export const SAVE_FILE = "./state.json";

export const BOARD_X = 0;
export const BOARD_Y = 60;
export const BOARD_WIDTH = WINDOW_WIDTH;
export const BOARD_HEIGHT = WINDOW_HEIGHT - BOARD_Y * 2; // Adjust the height to fit the window
export const BOARD: Rectangle = {
    x: BOARD_X,
    y: BOARD_Y,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
};

export const BACKGROUND = GetColor(0x030303FF); // Define a color constant for black
export const RED = GetColor(0xFF0000FF); // Define a color constant for white
export const BLUE = GetColor(0x0000FFFF); // Define a color constant for white
export const WHITE = GetColor(0xFFFFFFFF); // Define a color constant for white
export const DARK = GetColor(0x101010FF); // Define a color constant for white
