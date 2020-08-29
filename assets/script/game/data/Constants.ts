import { _decorator, Component, Node } from "cc";
import { Game } from "../Game";

const { ccclass, property } = _decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true

cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)


// enum EventName {
//     GREETING = 'greeting',
//     GOODBYE = 'goodbye',
//     FINISHED_WALK = 'finished-walk',
//     START_BRAKING = 'start-braking',
//     END_BRAKING = 'end-braking',
//     SHOW_COIN = 'show-coin',
//     GAME_START = 'game-start',
//     GAME_OVER = 'game-over',
//     NEW_LEVEL = 'new-level',
//     SHOW_TALK = 'show-talk',
//     SHOW_GUIDE = 'show-guide',
//     UPDATE_PROGRESS = 'update-progress',
// }

// enum CustomerState {
//     NONE,
//     GREETING,
//     GOODBYE,
// }

// enum AudioSource {
//     BACKGROUND = 'background',
//     CLICK = 'click',
//     CRASH = 'crash',
//     GETMONEY = 'getMoney',
//     INCAR = 'inCar',
//     NEWORDER = 'newOrder',
//     START = 'start',
//     STOP = 'stop',
//     TOOTING1 = 'tooting1',
//     TOOTING2 = 'tooting2',
//     WIN = 'win',
// }

enum PhysicsGroup {
    NONE = 0,
    ROLE = 1 << 0,
    CUBE = 1 << 1,
    HALFCUBE = 1 << 2,
    ENEMY = 1 << 3,
    ATTACK = 1 << 4,
}

export enum PLAYERANIMSTATE {
    IDLE = 'Char-Bones|idle',
    WALK = 'Char-Bones|walk',
    ROLL = 'Char-Bones|roll',
    WAVE = 'Char-Bones|wave'
}

export enum ENEMYANIMSTATE {
    IDLE = 'Bones:Zombie|idle',
    WALK = 'Bones:Zombie|walk',
    HURT = 'Bones:Zombie|hurt',
    WAVE = 'Bones:Zombie|wave'
}

@ccclass("Constants")
export class Constants {
    // public static EventName = EventName;
    // public static CustomerState = CustomerState;
    // public static AudioSource = AudioSource;

    static game: Game;

    public static PhysicsGroup = PhysicsGroup;



    // static roleManager: RoleManager;
    // public static talkTable = [
    //     'Please hurry up.\n I have a plane to catch',
    //     'The most beautiful day \nis not the rainy day',
    // ];

    // public static UIPage = {
    //     mainUI: 'mainUI',
    //     gameUI: 'gameUI',
    //     resultUI: 'resultUI',
    // };

    // public static GameConfigID = 'TAXI_GAME_CACHE';
    // public static PlayerConfigID = 'playerInfo';
    // public static MaxLevel = 20;
}
