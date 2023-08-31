import { Label, Tag, Text } from "react-konva";

interface IProps {
	x: number;
	y: number;
	text: string;
	name: string;
	visible: boolean;
}

export default function KonvaTooltip({ x, y, text, name, visible }: IProps) {
	return (
		<Label x={x} y={y} opacity={0.75} visible={visible} name={name}>
			<Tag
				{...{
					fill: "black",
					pointerDirection: "down",
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: "round",
					shadowColor: "black",
					shadowBlur: 10,
					shadowOffsetX: 10,
					shadowOffsetY: 10,
					shadowOpacity: 0.5
				}}
			></Tag>
			<Text
				{...{
					text,
					fontFamily: "Calibri",
					fontSize: 18,
					padding: 5,
					fill: "white"
				}}
			></Text>
		</Label>
	);
}
