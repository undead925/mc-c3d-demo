import { _decorator, Component, Node, Enum, ColliderComponent } from 'cc';
import { Constants } from "./data/Constants";
const { ccclass, property } = _decorator;

Enum(Constants.PhysicsGroup)

@ccclass('setGroupMask')
export class setGroupMask extends Component {


    // @property({
    //     type: Constants.PhysicsGroup,
    // })
    // physicsGroup = Constants.PhysicsGroup.JUMP_TRIGGER;

    // @property({
    //     type: Constants.PhysicsGroup,
    // })
    // physicsMask = Constants.PhysicsGroup.ALL;

    private collider: ColliderComponent = null;


    start () {
        // Your initialization goes here.
        this.collider = this.node.getComponent(ColliderComponent);
        
        this.collider.setGroup(this.node.layer);

        // this.collider.setMask(this.physicsMask);

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
