import { _decorator, Component, Node , ModelComponent} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockBatching')
export class blockBatching extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.

        // console.log(this.node.children)

        // this.node.children.forEach( (combin) => {
        //     const block = combin.children[0];    
        //     const materials = block.getComponent(ModelComponent).materials;
        //     // const pass = mat.passes[0];

        //     materials.forEach((mat) => {
        //         mat.recompileShaders({USE_BATCHING : true})
        //     })
        //     // mat.recompileShaders({USE_TEXTURE : false})
        // })
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
