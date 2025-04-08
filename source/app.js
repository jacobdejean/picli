import React, {useRef} from 'react';
import {Text, Box, useInput, useFocus, useFocusManager} from 'ink';

// Two characters per pixel for a more square aspect
const ratioMult = 2;

export default function App({name = 'Stranger'}) {
	const selectedX = useRef(0);
	const selectedY = useRef(0);
	const {focus} = useFocusManager();
	useInput((input, key) => {
		if (key.leftArrow) selectedX.current -= 1;
		if (key.rightArrow) selectedX.current += 1;
		if (key.upArrow) selectedY.current -= 1;
		if (key.downArrow) selectedY.current += 1;
		if (key.leftArrow || key.rightArrow || key.upArrow || key.downArrow) {
			const targetId = selectedX.current + ',' + selectedY.current;
			focus(targetId);
		}
	});
	return (
		<Box>
			<Text>{selectedX.current + ',' + selectedY.current}</Text>
			<Canvas
				width={30}
				height={30}
				selectedX={selectedX}
				selectedY={selectedY}
			/>
		</Box>
	);
}

function Canvas({width, height, selectedX, selectedY}) {
	return (
		<Box width={width * ratioMult} height={height}>
			{Array.from({length: height}).map((_, y) => (
				<Text>
					{Array.from({length: width}).map((_, x) => (
						<Pixel x={y} y={x} /> // I hate it too T.T
					))}
				</Text>
			))}
		</Box>
	);
}

function Pixel({x, y}) {
	const id = x + ',' + y;
	const {isFocused} = useFocus({
		id,
	});
	return (
		<>
			<Text
				key={id}
				color="green"
				backgroundColor={isFocused ? '#FFFFFF' : '#E1E1E1'}
			>
				{x.toString()[0] + '' + y.toString()[0]}
			</Text>
		</>
	);
}
