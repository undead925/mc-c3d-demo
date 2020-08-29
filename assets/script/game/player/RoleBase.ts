import { _decorator, Component, Node, ColliderComponent, ITriggerEvent, Material, Vec3, ICollisionEvent, Vec2, RigidBodyComponent } from 'cc';
import { PlayerState } from './PlayerState';
import { EnemyState } from '../enemy/EnemyState';
import { PLAYERANIMSTATE, ENEMYANIMSTATE } from '../data/Constants';
const { ccclass, property } = _decorator;


const _tempVec3 = new Vec3();
const Horizontal = new Vec2(1, 0);

@ccclass('RoleBase')
export class RoleBase extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    protected collider: ColliderComponent = null;

    protected rigidBody: RigidBodyComponent = null;

    protected roleState: PlayerState | EnemyState = null;

    protected velocity: Vec3 = new Vec3();

    protected _moveDelta: Vec2 = new Vec2(0, 0);


    protected _destination: Vec3 = new Vec3(0, 0, 0);

    protected set destination(pos){
        if(pos.equals(this._destination)){
            return
        }

        this._destination.set(pos);
        this.onDestinationChange();
    }

    protected get destination () {
        return this._destination;
    }

    protected _moveSpeed: number = 5;

    protected _moveTime: number = null;

    

    start () {
        // Your initialization goes here.

        this.collider = this.node.getComponent(ColliderComponent);  

        // this.collider.on('onTriggerEnter',this.onTrigger,this);
    }

    
    onTrigger(event:ITriggerEvent){

    }

    protected trunEulerAnglesByDelta(Delta: Vec2){
        // 计算角色的整体旋转值
        if(Delta.length() == 0) return;
        const deltaRadian = Delta.angle(Horizontal);       
        const angle = deltaRadian * 180 / Math.PI;
        const rot = this.node.eulerAngles;
        _tempVec3.set(rot.x, 90 - (Math.sign(Delta.y) || 1) * angle, rot.z);
        this.node.eulerAngles = _tempVec3;
    }

    protected onDestinationChange(){

        this._moveDelta.set(this.destination.x - this.node.position.x, this.destination.z - this.node.position.z);
          
        this._moveTime = this._moveDelta.length() / this._moveSpeed;

        this.trunEulerAnglesByDelta(this._moveDelta);
    
    }

    protected move(deltaTime: number, speed: number){


        _tempVec3.set(0, 0, speed * deltaTime);
        this.node.translate(_tempVec3);

    }

    protected onWalk(deltaTime: number){

        if(this._moveTime > 0){
            this._moveTime -= deltaTime;
            this.move(deltaTime, this._moveSpeed)
        }
        else{
            this.node.setPosition(_tempVec3.set(Math.round(this.node.position.x * 10) / 10, this.node.position.y, Math.round(this.node.position.z * 10) / 10));
            this.rigidBody.setLinearVelocity(_tempVec3.set(0,0,0));
            
            this.roleState.changeStateByString('IDLE')
        }        
    }


    update (deltaTime: number) {
        // Your update function goes here.

        // this.node.position = this.node.position.add(new Vec3(0,-deltaTime,0));
    }
}
