import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IsometricCamera')
export class IsometricCamera extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.

        // this.node.lookAt(new Vec3(0,0,-20))
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
