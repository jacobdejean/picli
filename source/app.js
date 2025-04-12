import React, { useRef, useState, useCallback, createContext, useContext } from 'react';
import { Text, Box, useInput, useFocus, useFocusManager, useApp } from 'ink';
import TextInput from 'ink-text-input';

// Two characters per pixel for a more square aspect
const ratioMult = 2;

const AppContext = createContext({
	selectedColor: '#FFFFFF',
	pickColor: () => { }
})

function useAppContext() {
	return useContext(AppContext)
}

export default function App({ name = 'Stranger' }) {
	const selectedX = useRef(0);
	const selectedY = useRef(0);
	const [selectedColor, setSelectedColor] = useState('white');
	const [isExporting, setExporting] = useState(false)
	const [exportFilename, setExportFilename] = useState(process.cwd())
	const { focus } = useFocusManager();
	useInput((input, key) => {
		if (key.leftArrow) selectedX.current -= 1;
		if (key.rightArrow) selectedX.current += 1;
		if (key.upArrow) selectedY.current -= 1;
		if (key.downArrow) selectedY.current += 1;
		if (key.leftArrow || key.rightArrow || key.upArrow || key.downArrow) {
			const targetId = selectedX.current + ',' + selectedY.current;
			focus(targetId);
		}
		if (key.return) {

		}

		if (input === 'e') {
			setExporting(true)
		}
	});
	const onPickColor = useCallback(nextColor => {
		setSelectedColor(nextColor)
	})
	const onExport = useCallback(filename => {
		setExporting(false)
	})
	return (
		<AppContext.Provider value={{
			selectedColor,
			pickColor: onPickColor
		}}>
			<Box flexDirection='column'>
				<Box flexDirection='row' justifyContent='space-between' width={'47'}>
					{!isExporting ? (
						<>
							<Box>
								<Text>{selectedX.current + ',' + selectedY.current}</Text>
								<Text>{' '}</Text>
								<ColorPalatte />
							</Box>
							<Text>(e)xport</Text>
						</>
					) : (
						<Box>
							<Text>Enter destination: </Text>
							<TextInput focus={isExporting} value={exportFilename} onChange={setExportFilename} onSubmit={onExport} />
						</Box>
					)}
				</Box>
				<Canvas
					width={30}
					height={30}
					selectedX={selectedX.current}
					selectedY={selectedY.current}
				/>
			</Box>
		</AppContext.Provider>
	);
}

function Canvas({ width, height, selectedX, selectedY }) {
	const { selectedColor } = useAppContext()
	const [colorMap, setColorMap] = useState(
		Array(height).fill().map(() => Array(width).fill("#EEE"))
	)
	useInput((input, key) => {
		if (input === ' ') {
			setColorMap(colorMap => {
				colorMap[selectedX][selectedY] = selectedColor
				return colorMap
			})
		}
	})
	return (
		<Box width={width * ratioMult} height={height}>
			{Array.from({ length: height }).map((_, y) => (
				<Text key={y}>
					{Array.from({ length: width }).map((_, x) => (
						<Pixel key={x} x={y} y={x} color={colorMap[y][x]} /> // I hate it too T.T
					))}
				</Text>
			))}
		</Box>
	);
}

function Pixel({ x, y, color }) {
	const id = x + ',' + y;
	const { selectedColor } = useAppContext()
	const { isFocused } = useFocus({
		id,
	});
	return (
		<>
			<Text
				key={id}
				color="black"
				backgroundColor={isFocused ? selectedColor : color}
			>
				{/* {x.toString()[0] + '' + y.toString()[0]} */}
				&nbsp;&nbsp;
			</Text>
		</>
	);
}

const paletteIndexKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function ColorPalatte() {
	const [colors, setColors] = useState([])
	const [isCreatingNewColor, setCreatingNewColor] = useState(false)
	const [newColorValue, setNewColorValue] = useState('')
	const { pickColor } = useAppContext()

	useInput((input, key) => {
		if (input === 'n') {
			setCreatingNewColor(true)
		}

		if (paletteIndexKeys.includes(input)) {
			pickColor(colors[Number(input) - 1])
		}
	});

	const onCreateColor = useCallback(newColor => {
		setColors(colors => colors.concat(newColor))
		setCreatingNewColor(false)
		setNewColorValue('')
	}, [])

	return (
		<Box flexDirection='row'>
			{colors.map(color => (
				<Pixel key={color} x={-5} y={-5} color={color} />
			))}
			{isCreatingNewColor ? (
				<Box flexDirection='row'>
					<Text>Enter color value: </Text>
					<TextInput focus={isCreatingNewColor} value={newColorValue} onChange={setNewColorValue} onSubmit={onCreateColor} />
				</Box>
			) : <Text>(n)ew color</Text>}
		</Box>
	)
}

