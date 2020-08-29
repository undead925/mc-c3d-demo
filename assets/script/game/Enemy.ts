import { _decorator, Component, Node, Vec3, CameraComponent, ColliderComponent, ITriggerEvent, SkinningModelComponent, Material, Color, tween, Vec2, RigidBodyComponent, AnimationComponent, Mat4, Vec4, Tween } from 'cc';
const { ccclass, property } = _decorator;
import { CustomEventListener } from "./data/CustomEventListener";
import { UIBillboardComponent } from '../../component/UIBillboardComponent/UIBillboardComponent';
import { RoleBase } from './player/RoleBase';
import { Constants, PLAYERANIMSTATE, ENEMYANIMSTATE } from './data/Constants';
import { Player } from './Player';
import { EnemyState } from './enemy/EnemyState';


const pos = new Vec3(0, 0, 0);
const _tempVec3 = new Vec3();
const playerPos = new Vec3(0, 0, 0);

const _tempMat = new Mat4();

let dir = 1;
@ccclass('Enemy')
export class Enemy extends RoleBase {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    collider: ColliderComponent = null;

    @property({
        type: SkinningModelComponent
    })
    model: SkinningModelComponent = null;

    @property({
        type: UIBillboardComponent
    })
    hpProgress: UIBillboardComponent = null;

    @property({
        type: UIBillboardComponent
    })
    hpProgressBar: UIBillboardComponent = null;

    protected animComp: AnimationComponent = null;

    material: Material = null;

    public set destination(pos){

        // if(pos.equals(this._destination) || (this.attackTarget && this.roleState.enemyState == ENEMYANIMSTATE.WAVE)){
        //     return
        // }

        this._destination.set(pos);
        this.onDestinationChange();
    }

    public get destination () {
        return this._destination;
    }


    protected _moveSpeed: number = 1;

    protected rigidBody: RigidBodyComponent = null;

    protected _attackRange: number = 1.5;

    protected _searchRange: number = 4;

    protected _maxHp: number = 30;

    get maxHp () {
        return this._maxHp;
    }

    protected _hp: number = 30;

    get hp () {
        return this._hp;
    }

    set hp (num: number) {
        this._hp = num > 0 ? num : 0;
    }

    public roleState: EnemyState = null;

    public attackTarget: Node = null;

    private showHpProgressTween: Tween = null;
    private showHpProgressBarTween: Tween = null;

    start () {
        // Your initialization goes here.

        super.start();

        this.roleState = new EnemyState();
        this.roleState.initialize(this);

        this.roleState.changeState(ENEMYANIMSTATE.IDLE);

        this.rigidBody = this.node.getComponent(RigidBodyComponent);    

        this.animComp = this.node.getComponent(AnimationComponent);

        this.animComp.getState(ENEMYANIMSTATE.IDLE).speed = 0.5;
        this.animComp.getState(ENEMYANIMSTATE.WALK).speed = 0.5;
        // this.animComp.getState(ENEMYANIMSTATE.ROLL).speed = 2;
        this.animComp.getState(ENEMYANIMSTATE.HURT).repeatCount = 1;
        this.animComp.on(AnimationComponent.EventType.FINISHED, this.roleState.onAnimFinish, this.roleState);

        this.material = this.model.material;

        this.collider.on('onTriggerEnter',this.onTrigger,this);

        this.collider.setMask(Constants.PhysicsGroup.CUBE + Constants.PhysicsGroup.HALFCUBE + Constants.PhysicsGroup.ATTACK + Constants.PhysicsGroup.ENEMY);

        this.initHp();


    }

    initHp () {
        this.updateHpView();

        // this.hpProgress.tintColor = new Color(48, 18, 23, 0);
        // this.hpProgressBar.tintColor = new Color(127, 40, 30, 0);
        this.hpProgress.tintColor = new Color(0, 0, 0, 0);
        this.hpProgressBar.tintColor = new Color(0, 0, 0, 0);

        this.showHpProgressTween = tween().to(0.5, { tintColor: new Vec4(48 / 255, 18 / 255, 23 / 255, 1) }).delay(1).to(1, { tintColor: new Vec4(0, 0, 0, 0) });
        this.showHpProgressBarTween = tween().to(0.5, { tintColor: new Vec4(127 / 255, 40 / 255, 30 / 255, 1) }).delay(1).to(1, { tintColor: new Vec4(0, 0, 0, 0) });
    }

    updateHpView () {
        this.hpProgressBar.width = this.hp / this.maxHp;
    }

    getDamage (damage: number) {
        CustomEventListener.dispatchEvent('show-damage-number', this, damage);

        _tempVec3.set(0, 0.5, 0);
        this.node.translate(_tempVec3);


        _tempVec3.set(0, 0, -3);
        this.node.getWorldRS(_tempMat);
        _tempVec3.transformMat4(_tempMat);
        this.rigidBody.setLinearVelocity(_tempVec3);

        this.hp -= damage;
        // console.log(this.hp);

        this.showHpProgressTween.target(this.hpProgress).start();
        this.showHpProgressBarTween.target(this.hpProgressBar).start();

        this.updateHpView();        
    }

    onTrigger(event:ITriggerEvent){

        if(event.otherCollider.node.name === "sword"){
            if(Constants.game.player.waveEnemys.indexOf(this) < 0){
                this.getDamage(10 + Math.floor(Math.random() * 5))
                Constants.game.player.waveEnemys.push(this);
                // this.roleState.changeState(ENEMYANIMSTATE.HURT);
            }
        }
    }

    searchPlayer(){
        playerPos.set(Constants.game.player.node.position);

        this._moveDelta.set(playerPos.x - this.node.position.x, playerPos.z - this.node.position.z);

        if(this._moveDelta.length() < this._searchRange){
            console.log(this.node.name + ' searched')
            this.roleState.changeState(ENEMYANIMSTATE.WALK);
            this.attackTarget = Constants.game.player.node;
        }
    }

    onDestinationChange(){

        super.onDestinationChange()

        this.roleState.changeState(ENEMYANIMSTATE.WALK, ENEMYANIMSTATE.IDLE);       
    }

    checkAttack(){
        
        const enmeyPos = this.attackTarget.position;

        const delta = new Vec2(0,0);

        delta.set(enmeyPos.x - this.node.position.x, enmeyPos.z - this.node.position.z);

        const length = delta.length();

        if(length < this._attackRange){
            this.roleState.changeState(ENEMYANIMSTATE.WAVE, ENEMYANIMSTATE.WALK, ENEMYANIMSTATE.IDLE);
            this.trunEulerAnglesByDelta(delta);

        }
        else if(length < this._searchRange){
            this.roleState.changeState(ENEMYANIMSTATE.IDLE, ENEMYANIMSTATE.WAVE);
            this.destination = enmeyPos;                     
        }
    }

    trunEulerAnglesByDelta(Delta){

        super.trunEulerAnglesByDelta(Delta);

        this.node.children.forEach( (node: Node) =>{
            if(node.name === "attackLockEffect"){
                node.setWorldRotationFromEuler(0,0,0)
            }
        })
    }

    onWalk(deltaTime){
        super.onWalk(deltaTime);
    }

    playAnim(name: ENEMYANIMSTATE){
        this.animComp.play(name);        
    }

    update (deltaTime: number) {
        // Your update function goes here.

        super.update(deltaTime);

        this.roleState.update(deltaTime);
             
    }
}
