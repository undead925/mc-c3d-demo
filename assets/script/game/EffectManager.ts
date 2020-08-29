import { _decorator, Component, Node, Prefab, Vec3, tween, Color, Vec4 } from 'cc';
import { CustomEventListener } from "./data/CustomEventListener";
import { PoolManager } from "./data/PoolManager";
import { Constants } from './data/Constants';
import { UIBillboardComponent } from '../../component/UIBillboardComponent/UIBillboardComponent';
import { RoleBase } from './player/RoleBase';
import { Enemy } from './Enemy';
import { Player } from './Player';
const { ccclass, property } = _decorator;

const _tempVec3 = new Vec3();
@ccclass('EffectManager')
export class EffectManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({
        type: Node
    })
    canvas: Node = null;

    @property({
        type: Prefab
    })
    attackLockEffect: Prefab = null;

    @property({
        type: Prefab
    })
    numberLabel: Prefab = null;

    
    @property({
        type: Prefab
    })
    billboardLabel: Prefab = null;

    start () {
        // Your initialization goes here.
        CustomEventListener.on('set-attack-target', this.setAttackTarget, this);
        CustomEventListener.on('show-damage-number', this.showDamageNumber, this);
    }

    setAttackTarget(target: Node) {
        const effect = PoolManager.instance.getNode(this.attackLockEffect, target);
        // console.log(target);

        effect.setWorldRotationFromEuler(0,0,0);
        effect.setPosition(0,-0.5,0);
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(effect);
            // console.log(PoolManager.instance);
        }, 4);
    }

    showDamageNumber(target: Enemy | Player, damage: number){

        const role = target.node;
        const billboardLabel = PoolManager.instance.getNode(this.billboardLabel, role.parent);
        const billboardComp = billboardLabel.getComponent(UIBillboardComponent);


        const randomX = Math.random() - 0.5;
        const randomY = Math.random() + 2;
        const randomZ = Math.random() - 0.5;

        billboardLabel.setPosition(role.position.x + randomX, role.position.y + randomY , role.position.z + randomZ);

        billboardComp.numberLabel.string = damage.toString();
        billboardComp.numberLabel.node.parent = this.canvas;
        billboardComp.numberLabel.updateRenderData(true);
        billboardComp.numberLabel.node.parent = billboardLabel;
        billboardComp.setLabelTexture();

        billboardComp.tintColor = new Color(127, 127, 127, 127);
        // console.log(PoolManager.instance);
        // console.log(billboardLabel);
        tween(billboardLabel)
            .by(1, { position: new Vec3(0, 1, 0) }, { easing: 'elasticOut' })
            .call(() => {PoolManager.instance.putNode(billboardLabel)})
            .start();

        tween(billboardComp)
            .to(1, { tintColor: new Vec4(0.5, 0.5, 0.5, 0) })
            .start();


        target.material.setProperty("emissive", new Color(255, 200 , 80));
    
        tween(target.node)
            .delay(0.05)
            .call(() => { target.material.setProperty("emissive", new Color(0, 0 , 0))})
            .start()

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
