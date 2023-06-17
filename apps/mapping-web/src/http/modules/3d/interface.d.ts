interface Ibase {
    coordinate: string
}

interface IFloor extends Ibase {

}

interface Ishelf extends Ibase {
    binLength: number;
    binWidth: number;
    binHeight: number;
    bottomHeight: number;
    numX: number;
    numY: number;
    numZ: number;
}

interface Iarea extends Ibase {
    type: string;
    shelfs: Ishelf[]
}

interface I3dBase {
    floor: IFloor;
    areas: Iarea[]
}

interface I3dGoods extends Ibase{
    hasGoods: boolean;
    goodsType?: any;
    height: number;
}