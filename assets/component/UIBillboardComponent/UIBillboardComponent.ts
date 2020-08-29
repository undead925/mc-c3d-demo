import { _decorator, Component, Node, BillboardComponent, Material, LabelComponent, renderer, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBillboardComponent')
export class UIBillboardComponent extends BillboardComponent {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    // @property({
    //     type: renderer.MaterialInstance,
    // })
    private _material : Material = null;

    @property({
        type: Material,
    })
    sharedMaterial : Material = null;

    @property({
        type: LabelComponent,
    })
    numberLabel: LabelComponent = null;

    @property({
        type: Color,
    })
    color : Color = new Color(127,127,127,127);

    public onLoad () {
        this._material = new renderer.MaterialInstance({parent: this.sharedMaterial});      
        super.onLoad();
        this.tintColor = this.color;
    }

    setLabelTexture(){
        this.texture = (this.numberLabel.spriteFrame as any).texture
    }

    private _tintColor : Color = null;
    get tintColor () {
        return this._tintColor
    }

    set tintColor (color: Color) {
        this._tintColor = color;
        this._material.setProperty("tintColor", this._tintColor);
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
