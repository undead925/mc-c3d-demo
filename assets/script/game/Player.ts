import { _decorator, Component, macro, Node, Vec2, Vec3, Color, AnimationComponent, RigidBodyComponent, ColliderComponent, CameraComponent, ParticleSystemComponent, systemEvent, SystemEventType, Touch, geometry, PhysicsSystem, ModelComponent, AnimationState, Prefab, Material} from "cc";
import { Constants , PLAYERANIMSTATE} from "./data/Constants";
import { CustomEventListener } from "./data/CustomEventListener";
import { PoolManager } from "./data/PoolManager";
import { PlayerState } from "./player/PlayerState";
import { RoleControl } from "./player/RoleControl";
import { RoleBase } from "./player/RoleBase";
import { Enemy } from "./Enemy";
const { ray } = geometry;
const { PhysicsGroup } = Constants;
const { ccclass, property } = _decorator;




const _tempVec3 = new Vec3();
const Horizontal = new Vec2(1, 0);
const MOVE_VELOCITY = new Vec3(0, 0, 10);
const CAMERA_POS = new Vec3(10, 10, 10);
const resetPos = new Vec3(-10,-100,-10);

@ccclass('Player')
export class Player extends RoleBase {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({
        type: Node
    })
    hoverEffect: Node = null;

    @property({
        type: ParticleSystemComponent
    })
    trailEffect: ParticleSystemComponent = null;

    dustEffect: Node = null;

    
    @property({
        type: Prefab
    })
    dustEffectPrefab: Prefab = null;

    dustRollEffect: Node = null;

    @property({
        type: Prefab
    })
    dustRollEffectPrefab: Prefab = null;
    
    public roleState: PlayerState = null;

    @property({
        type: RoleControl
    })
    public roleControl: RoleControl = null;

    material: Material = null;

    waveEnemys: Enemy[] = [];

    protected animComp: AnimationComponent = null;
    protected rigidBody: RigidBodyComponent = null;
    protected collider: ColliderComponent = null;
    protected cubeTrigger: ColliderComponent = null;
    protected swordTrigger: ColliderComponent = null;

    protected physicsSystem = PhysicsSystem.instance;

    protected _playerState = PLAYERANIMSTATE.IDLE;

    public set destination(pos){

        if(pos.equals(this._destination) || this.roleState.playerState == PLAYERANIMSTATE.ROLL || (this.attackTarget && this.roleState.playerState == PLAYERANIMSTATE.WAVE)){
            return
        }

        this._destination.set(pos);
        this.onDestinationChange();
    }

    public get destination () {
        return this._destination;
    }

    protected _moveSpeed: number = 5;

    private _attackTarget: Node = null;

    set attackTarget (target: Node){
        if(this._attackTarget !== target ){
            this._attackTarget = target;

            if(this._attackTarget){
                CustomEventListener.dispatchEvent('set-attack-target', this._attackTarget);

                this.hoverEffect.active = false;
            }
        }       
    }

    get attackTarget () {
        return this._attackTarget!;
    }

    private _isTriggerHalf = false;

    private _rollTime = 0;


    private _hoverEnemy = null;
    private _hoverEnemyMat = null;

    set hoverEnemy (enemy: Node) {

        if(this._hoverEnemy == enemy){
            return;
        }

        this._hoverEnemy = enemy;

        if(this._hoverEnemyMat){
            this._hoverEnemyMat.passes[0].setUniform(this._hoverEnemyMat.passes[0].getHandle('depthBias'), 0);
            this._hoverEnemyMat = null;
        }

        if(this._hoverEnemy){
            this._hoverEnemyMat = this._hoverEnemy.getChildByPath('RootNode/Mob_Zombie').getComponent(ModelComponent).material;
            let pass = this._hoverEnemyMat.passes[0];

            // pass.setUniform(pass.getHandle('mainColor'), new Color('#00ff00'));

            // mat.setProperty('lineWidth', 30);
            pass.setUniform(pass.getHandle('depthBias'), 3);
        }

    }

    get hoverEnemy () {
        return this._hoverEnemy
    }


    private _attckTime = 0;

    start () {
        // Your initialization goes here.

        super.start();

        Constants.game.player = this;

        this.roleState = new PlayerState();
        this.roleState.initialize(this);

        this.roleControl.initialize(this);

        this.animComp = this.node.getComponent(AnimationComponent);

        this.cubeTrigger = this.node.getChildByName('trigger').getComponent(ColliderComponent);

        this.swordTrigger = this.node.getChildByPath('Arm:Right:Lower Socket/Sword:Iron/sword').getComponent(ColliderComponent);

        this.rigidBody = this.node.getComponent(RigidBodyComponent);    

        this.animComp.getState(PLAYERANIMSTATE.WALK).speed = 2;
        this.animComp.getState(PLAYERANIMSTATE.ROLL).speed = 2;
        this.animComp.getState(PLAYERANIMSTATE.WAVE).repeatCount = 1;
        this.animComp.on(AnimationComponent.EventType.FINISHED, this.roleState.onAnimFinish, this.roleState);


        this.trailEffect.enabled = true;
        this.trailEffect.stop();

        
        this.dustEffect = PoolManager.instance.getNode(this.dustEffectPrefab, this.node.parent);
        this.dustEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).stop();
        })

        this.dustRollEffect = PoolManager.instance.getNode(this.dustRollEffectPrefab, this.node.parent);
        this.dustRollEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).stop();
        })


        this.cubeTrigger.setMask(PhysicsGroup.CUBE + PhysicsGroup.HALFCUBE);

        this.cubeTrigger.on('onTriggerEnter',this.onTrigger,this);


        this.collider.setGroup(this.node.layer);

        console.log(this.node)


        this.swordTrigger.setGroup(PhysicsGroup.ATTACK);
        this.swordTrigger.setMask(PhysicsGroup.ENEMY);

        // const mat = this.hoverEffect.getChildByName('Quad').getComponent(ModelComponent).material;
        // const pass = mat.passes[0];

        // pass.setUniform(pass.getHandle('mainColor'), new Color('#00ff00'));

        // mat.recompileShaders({USE_TEXTURE : false})
    }


    onCollision(event){

    }

    onTrigger(event){


        //碰到地板
        if(event.otherCollider.getGroup() == PhysicsGroup.HALFCUBE){

            this._isTriggerHalf = true;            
    
        }
    }

    onDestinationChange(){


        if(!this.attackTarget){

            this.hoverEffect.active = true;

            _tempVec3.set(this.destination.x, this.destination.y , this.destination.z);

            this.hoverEffect.setPosition(_tempVec3);
        }
       
        super.onDestinationChange()

        this.roleState.changeState(PLAYERANIMSTATE.WALK, PLAYERANIMSTATE.IDLE, this.attackTarget ? PLAYERANIMSTATE.IDLE : PLAYERANIMSTATE.WAVE); // 没有_attackTarget才能取消        
    }

    checkAttack(){

        const enmeyPos = this.attackTarget.position;

        const delta = new Vec2(0,0);

        delta.set(enmeyPos.x - this.node.position.x, enmeyPos.z - this.node.position.z);

        if(delta.length() < 1.5){
            this.roleState.changeState(PLAYERANIMSTATE.WAVE, PLAYERANIMSTATE.WALK, PLAYERANIMSTATE.IDLE);
            this.trunEulerAnglesByDelta(delta);

        }
        else{
            // this.roleState.changeState(PLAYERANIMSTATE.IDLE, PLAYERANIMSTATE.WAVE);
            this.destination = enmeyPos;
        }
    }


    resetStatus (){

        // this.trailEffect.enabled = false;

        this.trailEffect.stop();

        this.swordTrigger.setMask(PhysicsGroup.NONE);

        this.waveEnemys = [];


        this.dustEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).loop = false;
        })

        
        this.dustRollEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).loop = false;
        })

        
        this._attckTime = 0;

    }

    playAnim(name: PLAYERANIMSTATE){
        this.animComp.play(name);        
    }

    startWalk(){

        this.dustEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).play();

            node.getComponent(ParticleSystemComponent).loop = true;

        })

    }

    startRoll(){

        this.attackTarget = null;
        this._destination.set(resetPos);

        this.dustRollEffect.children.forEach( (node) => {
            node.getComponent(ParticleSystemComponent).play();

            node.getComponent(ParticleSystemComponent).loop = true;

        })
        this._rollTime = 0.5;

    }

    attackEnemy(){
        // _tempVec3.set(-0.5, 0, 0);
        // this.attackTarget && this.attackTarget.translate(_tempVec3);
    }

    move(deltaTime: number, speed: number){

        if(this._isTriggerHalf){
            _tempVec3.set(0, 0.6, 0);
            this.node.translate(_tempVec3);
            this._isTriggerHalf = false;
        }

        super.move(deltaTime, speed);
    }
    


    onWalk(deltaTime: number){

        Vec3.add(_tempVec3, this.node.position, new Vec3(0,0.3,0));
        this.dustEffect.setPosition(_tempVec3);

        super.onWalk(deltaTime);
        
    }


    onRoll(deltaTime: number){

        Vec3.add(_tempVec3, this.node.position, new Vec3(0,0.3,0));
        this.dustRollEffect.setPosition(_tempVec3);

        if(this._rollTime > 0){
            this._rollTime -= deltaTime;
            this.move(deltaTime, 10)
        }
        else{
            this.roleState.changeState(PLAYERANIMSTATE.IDLE);
        }
        
    }

    onWave(deltaTime: number){


        this._attckTime += deltaTime;
        if(this._attckTime > 0.21){
            this.trailEffect.play()
            this.swordTrigger.setMask(PhysicsGroup.ENEMY);
        }


        if(this._attckTime > 0.35){
            this.swordTrigger.setMask(PhysicsGroup.NONE);
        }
    }

    

    update(deltaTime: number){

        this.roleState.update(deltaTime);

        this.roleControl.playerUpdate(deltaTime);

        Vec3.add(_tempVec3, this.node.position, CAMERA_POS);
        _tempVec3.y = (_tempVec3.y - Constants.game.cameraCom.node.position.y) * deltaTime + Constants.game.cameraCom.node.position.y;

        _tempVec3.y = Math.max(_tempVec3.y, 5);
        Constants.game.cameraCom.node.setPosition(_tempVec3);


        if(this.node.position.y < -20){
            this.node.setPosition(_tempVec3.set(0,1,0))
        }
        
      
       
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
