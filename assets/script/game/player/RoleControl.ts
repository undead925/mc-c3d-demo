import { _decorator, Component, Node, systemEvent,SystemEventType, Touch, geometry, PhysicsSystem, macro, game} from 'cc';
import { Constants , PLAYERANIMSTATE} from "../data/Constants";
import { Player } from "../Player";
const { ccclass, property } = _decorator;
const { ray } = geometry;
const { PhysicsGroup } = Constants;


@ccclass('RoleControl')
export class RoleControl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private player: Player = null;

    private _isTouch = false;

    private _isShift = false;

    private _lastTouch = null;

    private _lastMouse = null;

    protected physicsSystem = PhysicsSystem.instance;

    start () {
        // Your initialization goes here.
        console.log('RoleControl')
        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);

        systemEvent.on(SystemEventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEventType.MOUSE_MOVE, this.onMouseMove, this);

        systemEvent.on(SystemEventType.KEY_UP,this.onKeyUp,this);
        systemEvent.on(SystemEventType.KEY_DOWN,this.onKeyDown,this);
    }

    public initialize (player: Player) {
        console.log('RoleControl initialize')
        this.player = player;
    }

    onTouch(){

        if(this.player.roleState.playerState == PLAYERANIMSTATE.ROLL){
            return;
        }

        if(this._isShift){
            this.player.roleState.changeState(PLAYERANIMSTATE.WAVE);
        }

        const touch = this._lastTouch;

        const outRay = new ray();

        Constants.game.cameraCom.screenPointToRay(touch.getLocationX(), touch.getLocationY(), outRay);

        

      

        if(this.physicsSystem.raycastClosest(outRay, PhysicsGroup.ENEMY)){

            this.player.attackTarget = this.physicsSystem.raycastClosestResult.collider.node;

        }
        else{

            this.player.attackTarget = null;

            if(this.physicsSystem.raycastClosest(outRay, PhysicsGroup.CUBE + PhysicsGroup.HALFCUBE)){           
                
                
                this.player.destination = this.physicsSystem.raycastClosestResult.collider.node.worldPosition;
                
            }

        }

    }

    onTouchStart(touch: Touch){
            

        this._isTouch = true;

        this._lastTouch = touch;

        this.onTouch();
        
    }

    onTouchMove(touch: Touch){

        if(!this._isTouch){
            return;
        }

        this._lastTouch = touch;
    }


    onTouchEnd(touch: Touch){
        

        this._isTouch = false;

        // this.roleState.changeState(PLAYERANIMSTATE.IDLE);
    }

    onHover(){
        const event = this._lastMouse;

        const outRay = new ray();

        Constants.game.cameraCom.screenPointToRay(event.getLocationX(), event.getLocationY(), outRay);        

        if(this.physicsSystem.raycastClosest(outRay, PhysicsGroup.ENEMY)){

            const enemy =  this.physicsSystem.raycastClosestResult.collider.node;
            
            this.player.hoverEnemy =enemy;

            this.player.hoverEffect.active = false;
        }
        else{

            this.player.hoverEnemy = null;

            if(this.physicsSystem.raycastClosest(outRay, PhysicsGroup.CUBE + PhysicsGroup.HALFCUBE)){

                const destination = this.physicsSystem.raycastClosestResult.collider.node.worldPosition;
    
                this.player.hoverEffect.setPosition(destination);
    
                this.player.hoverEffect.active = true;
            }
        }
    }
      
    
    onMouseDown(event) {
        if (event.getButton() === 2) {
            
        } 
    }

    onMouseMove(event){

        this._lastMouse = event;
    
    }

    onKeyUp(event){

        switch(event.keyCode) {
            case macro.KEY.space:
                // this.roleState.changeState(PLAYERANIMSTATE.ROLL);
                break;
            case macro.KEY.shift:
                this._isShift = false;
                break;
        }
        
    }

    onKeyDown(event){

        switch(event.keyCode) {
            case macro.KEY.space:
                this.player.roleState.changeState(PLAYERANIMSTATE.ROLL);
                break;
            case macro.KEY.shift:
                this._isShift = true;
                break;
        }
    }


    playerUpdate (deltaTime: number) {
        // Your update function goes here.

        if(this._isTouch){
            this.onTouch()
        }

        if(this._lastMouse){
            this.onHover()
        }
    }
}
