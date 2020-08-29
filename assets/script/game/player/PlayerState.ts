import { _decorator, Component, Node } from 'cc';

import { Constants , PLAYERANIMSTATE} from "../data/Constants";
import { Player } from "../Player";
import { Enemy } from "../Enemy";
const { ccclass, property } = _decorator;

@ccclass('PlayerState')
export class PlayerState  {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    protected _playerState = PLAYERANIMSTATE.IDLE;

    get playerState (){
        return this._playerState;
    }

    private player: Player = null;

    start () {
        // Your initialization goes here.
    }

    public initialize (player) {
        this.player = player;
    }

    onLastStateEnd(from: PLAYERANIMSTATE, to: PLAYERANIMSTATE){

        this.player.resetStatus();

    }

    changeState(name: PLAYERANIMSTATE, ...from: Array<PLAYERANIMSTATE>){

        if(this._playerState === name){
            return;
        }

        if(from.length > 0 && from.indexOf(this._playerState) < 0){
            return;
        }

        this.onLastStateEnd(this._playerState, name);


        this.onStateStart(this._playerState, name);

        this.player.playAnim(name);        
        this._playerState = name;
        
        
    }

    changeStateByString(name: string, ...from: Array<string>){
        const fromStates: Array<PLAYERANIMSTATE> = [];

        from.forEach( (stateName) => {
            fromStates.push(PLAYERANIMSTATE[stateName])
        })

        this.changeState(PLAYERANIMSTATE[name], ...fromStates)
    }

    onStateStart(from: PLAYERANIMSTATE, to: PLAYERANIMSTATE){

        switch(to){
            case PLAYERANIMSTATE.WALK:            

                this.player.startWalk();
                break;
            case PLAYERANIMSTATE.ROLL:

                this.player.startRoll();

                break;
            case PLAYERANIMSTATE.WAVE:

                break;
        }

    }

    onAnimFinish(){

        switch(this._playerState){
            case PLAYERANIMSTATE.WALK:            

                break;
            case PLAYERANIMSTATE.ROLL:

                break;
            case PLAYERANIMSTATE.WAVE:
                // console.log('wave')
                // this.player.attackTarget.getComponent(Enemy).getDamage(10);
                break;
        }
        this.changeState(PLAYERANIMSTATE.IDLE);
    }

    update (deltaTime: number) {
        // Your update function goes here.

        switch(this._playerState){
            case PLAYERANIMSTATE.WALK:            
                this.player.onWalk(deltaTime);  
                break;
            case PLAYERANIMSTATE.ROLL:
                this.player.onRoll(deltaTime);  
                break;
            case PLAYERANIMSTATE.WAVE:
                this.player.onWave(deltaTime);       
                break;
        }

        if(this.player.attackTarget){
            this.player.checkAttack();
        }
    }



}
