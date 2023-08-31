declare interface Slot {
  name: string
  puDoPoint: string
  stagingPoints?: string[]
  vehicleTypes: string[]
  transferZones?: string[]
  forkArm: ForkArm
}

declare interface IRecordForkArm extends ForkArm {
  index: number;
  id: string;
}

declare interface ForkArm {
  liftHeight: number
  declineHeight: number
}


declare interface RCSPoints {
  Border: Border
  Points: Point[]
}

declare interface Border {
  DownLeft: DownLeft
  UpRight: UpRight
}

declare interface DownLeft {
  X: number
  Y: number
}

declare interface UpRight {
  X: number
  Y: number
}

declare interface Point {
  Id: string
  Position: Position
}

declare interface Position {
  X: number
  Y: number
}

enum EOperationMode {
  Drag = "drag",
  Selection = "selection",
  Rect = "rect",
  Point = "anchor",
}

enum ETabKey {
  Area = "area",
  Tunnel = "tunnel",
  Location = "location",
  Shelf = "shelf",
  Route = "route",
  LocationGroup = "locationGroup",
}

declare interface IOperation {
  key: EOperationMode;
  icon: string;
  popoverProps: PopoverProps;
  classname?: string;
  id?: string;
}

// store相关
declare interface ISize {
  width: number;
  height: number;
}

declare interface IPosition {
  left: number;
  top: number;
}

declare interface IVector {
  x: number;
  y: number;
}

declare type IVectorSize = ISize & IVector;

declare interface ILayouts {
  radio: number;
  offsetX: number;
  offsetY: number;
}

declare interface IInfoGroupRectProps {
  stroke?: string;
  fill?: string;
  opacity?: number;
}

declare interface IInfoGroupTextProps {
  fill?: string;
  fontSize?: number;
}

declare interface ITooltipProps extends IVector {
  text: string;
  visible: boolean;
}

declare interface ISlot {
  name: string;
  puDoPoint: string;
  stagingPoints: string[];
  vehicleTypes: string[];
  transferZones: string[];
  forkArm: {
    liftHeight: number;
    declineHeight: number;
  };
}

declare namespace Editor {
  interface IArrowAttrs {
    points: number[];
    name: string;
    id: string;
  }

  interface IKonvaAttrs extends IVectorSize {
    name: string;
    id: string;
  }

  interface TunnelArea {
    id: string;
    tunnelAreaCode: string;
    konvaAttrs: IKonvaAttrs;
    tab: 'tunnelArea'
  }

  interface IPaintingStatus {
    tunnelAreas: TunnelArea[]
  }

  interface Area extends API.AreaInfoDTO {
    label: string;
    tab: ETabKey.Area;
    konvaAttrs: IKonvaAttrs;
  }
  interface Location extends API.LocationInfoDTO {
    label: string;
    tab: ETabKey.Location;
    konvaAttrs: IKonvaAttrs;
  }
  interface Tunnel extends API.TunnelInfoDTO {
    label: string;
    tab: ETabKey.Tunnel;
    konvaAttrs: IKonvaAttrs;
  }
  interface Shelf extends API.ShelfInfoDTO {
    label: string;
    tab: ETabKey.Shelf;
    konvaAttrs: IKonvaAttrs;
  }
  interface ILocationGroup extends API.LocationGroupInfoDTO {
    label: string;
    tab: ETabKey.LocationGroup;
  }

  interface IRouting extends API.RoutingInfoDTO {
    konvaAttrs: IArrowAttrs;
    label: string;
    tab: ETabKey.Route;
  }

  interface IWarehouseData {
    [ETabKey.Area]: Area[];
    [ETabKey.Tunnel]: Tunnel[];
    [ETabKey.Shelf]: Shelf[];
    [ETabKey.Location]: Location[];
    [ETabKey.Route]: IRouting[];
    [ETabKey.LocationGroup]: ILocationGroup[];
  }

  type IWarehouseDataKey = keyof IWarehouseData;
  type IWarehouseList = IWarehouseData[IWarehouseDataKey];
  type IWarehouseDataItem = IWarehouseData[IWarehouseDataKey][number];
  type IWarehouseGroupData = Area | Tunnel | Shelf;

  //     type TWarehouseDataKeys = keyof IWarehouseData;
  //     type CommonTab = ETabKey.Area | ETabKey.Shelf | ETabKey.Tunnel;
  //     type IEntries = [keyof IWarehouseData, IWarehouseData[keyof IWarehouseData]];
  //     interface IMenuStyles {
  //       left: number;
  //       top: number;
  //     }
  //     interface ISectionProps {
  //       showGroupPoint: boolean;
  //       sectionList:
  //         | IWarehouseData[TWarehouseDataKeys]
  //         | IRouting[]
  //         | ILocationGroup[];
  //       onSelectionItemClick?: (
  //         name: IWarehouseData[TWarehouseDataKeys][number]
  //       ) => void;
  //       onSelectionItemDelete?: (
  //         name: IWarehouseData[TWarehouseDataKeys][number]
  //       ) => void;
  //       onSearch?: (value: string) => void;
  //     }
  //     interface IDrawerRef {
  //       setInitialValues: (values: any) => void;
  //     }
  //     interface IDrawerProps {
  //       open: boolean;
  //       currentSelectionItem: any;
  //       onClose: () => void;
  //       repositioning: () => void;
  //       onSave: (values: any) => void;
  //       onUpdate: (updateData: any) => void;
  //     }
  //     enum EOperationMode {
  //       Selection = "selection",
  //       Rect = "rect",
  //       Point = "anchor"
  //     }
  //     interface IOperation {
  //       key: EOperationMode;
  //       icon: string;
  //       popoverProps: PopoverProps;
  //       classname?: string;
  //       id?: string;
  //     }
}


