import { getAttrsBetweenPoints } from "@/utils";
import { Group, Arrow, Text } from "react-konva";

interface IProps extends Editor.IArrowAttrs {
  label: string;
  active: boolean;
  initialValues: any;
}

export default function InfoArrow({ points, name, active, id, label, initialValues }: IProps) {
  const attrs = getAttrsBetweenPoints(points);

  return (
    <Group name={name} initialValues={initialValues}>
      <Arrow
        points={points}
        id={id}
        pointerLength={40}
        pointerWidth={40}
        fill={active ? "#f97316" : "#aaa"}
        stroke={active ? "#f97316" : "#aaa"}
        strokeWidth={8}
      />
      <Text
        text={label}
        {...attrs}
        align="center"
        fill="#333"
        verticalAlign="middle"
      />
    </Group>
  );
}
