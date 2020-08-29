import { _decorator, Component, Node, CameraComponent } from 'cc';
import { Constants} from "./data/Constants";
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property({
        type: CameraComponent
    })
    cameraCom: CameraComponent = null;

    player: Player = null;

    __preload () {
        Constants.game = this;
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
