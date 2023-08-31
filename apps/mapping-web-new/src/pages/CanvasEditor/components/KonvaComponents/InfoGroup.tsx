import Konva from "konva";
import { Group, Rect, Text } from "react-konva";
import { round } from "lodash";
import { genAttrsWhenTransform } from "@/utils";

interface IProps<T> extends Konva.GroupConfig {
  text: string;
  rectProps?: IInfoGroupRectProps;
  textProps?: IInfoGroupTextProps;
  index: number;
  initialValues: T;
  onGroupTransformEnd?: (
    e: Konva.KonvaEventObject<Event>,
    index: number,
    rectAttrs: ReturnType<typeof genAttrsWhenTransform>,
    initialValues: T,
  ) => void;
  onGroupDragEnd?: (
    e: Konva.KonvaEventObject<DragEvent>,
    index: number,
    rectAttrs: ReturnType<typeof genAttrsWhenTransform>,
    initialValues: T
  ) => void;
  onGroupDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export default function InfoGroup<T>({
  id,
  x,
  y,
  width,
  height,
  index,
  name,
  rectProps,
  textProps,
  draggable,
  text,
  initialValues,
  onGroupTransformEnd,
  onGroupDragEnd,
  onGroupDragMove,
}: IProps<T>) {
  const onTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const attrs = genAttrsWhenTransform(e);
    onGroupTransformEnd?.(e, index, attrs, initialValues);
    node.scaleX(1);
    node.scaleY(1);
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const x = round(node.x(), 2);
    const y = round(node.y(), 2);
    const width = node.width();
    const height = node.height();
    const attrs = { x, y, width, height };
    onGroupDragEnd?.(e, index, attrs, initialValues);
  };

  return (
    <Group
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      name={name}
      draggable={draggable}
      onTransformEnd={onTransformEnd}
      onDragEnd={onDragEnd}
      onDragMove={onGroupDragMove}
      initialValues={initialValues}
    >
      <Rect
        x={0}
        y={0}
        strokeWidth={2}
        width={width}
        height={height}
        {...rectProps}
      />
      <Text
        x={0}
        y={0}
        text={text}
        width={width}
        height={height}
        {...textProps}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}
