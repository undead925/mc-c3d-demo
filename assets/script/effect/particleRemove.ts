import { _decorator, Component, Node, ParticleSystemComponent} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('particleRemove')
export class particleRemove extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property({
        type: ParticleSystemComponent
    })
    particleCom: ParticleSystemComponent = null;

    private _isStart = false;

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        // Your update function goes here.

        // console.log(this.particleCom.time)
    }
}
