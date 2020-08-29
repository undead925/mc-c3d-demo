import { _decorator, Component, Node } from 'cc';

import { Constants , PLAYERANIMSTATE, ENEMYANIMSTATE} from "../data/Constants";
import { Player } from "../Player";
import { Enemy } from "../Enemy";
const { ccclass, property } = _decorator;

@ccclass('EnemyState')
export class EnemyState  {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    protected _enemyState = ENEMYANIMSTATE.IDLE;

    get enemyState (){
        return this._enemyState;
    }

    private enemy: Enemy = null;

    start () {
        // Your initialization goes here.
    }

    public initialize (enemy) {
        this.enemy = enemy;
    }

    onLastStateEnd(from: ENEMYANIMSTATE, to: ENEMYANIMSTATE){


    }

    changeState(name: ENEMYANIMSTATE, ...from: Array<ENEMYANIMSTATE>){

        if(this._enemyState === name){
            return;
        }

        if(from.length > 0 && from.indexOf(this._enemyState) < 0){
            return;
        }

        this.onLastStateEnd(this._enemyState, name);


        this.onStateStart(this._enemyState, name);

        this.enemy.playAnim(name);        
        this._enemyState = name;
                
    }

    changeStateByString(name: string, ...from: Array<string>){
        const fromStates: Array<ENEMYANIMSTATE> = [];

        from.forEach( (stateName) => {
            fromStates.push(ENEMYANIMSTATE[stateName])
        })

        this.changeState(ENEMYANIMSTATE[name], ...fromStates)
    }

    onStateStart(from: ENEMYANIMSTATE, to: ENEMYANIMSTATE){

        switch(to){
            case ENEMYANIMSTATE.WALK:            

                // this.player.startWalk();
                break;
            case ENEMYANIMSTATE.WAVE:

                break;
        }

    }

    onAnimFinish(){

        switch(this._enemyState){
            case ENEMYANIMSTATE.WALK:            

                break;
            case ENEMYANIMSTATE.WAVE:
                // console.log('wave')
                break;
            case ENEMYANIMSTATE.HURT:            
                // console.log('hurt')

                break;
        }
        this.changeState(ENEMYANIMSTATE.IDLE);
    }

    update (deltaTime: number) {
        // Your update function goes here.

        switch(this._enemyState){
            case ENEMYANIMSTATE.IDLE:            
                this.enemy.searchPlayer();  
                break;
            case ENEMYANIMSTATE.WALK:            
                this.enemy.onWalk(deltaTime);  
                break;
            case ENEMYANIMSTATE.WAVE:
                // this.player.onWave(deltaTime);       
                break;
        }

        if(this.enemy.attackTarget){
            this.enemy.checkAttack();
        }
    }



}
