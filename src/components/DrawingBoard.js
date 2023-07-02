import React, { useEffect, useRef, useState } from "react"
import bezierCommand from "../utils/bezierCurve"
import { useSocket } from "../contexts/SocketProvider"

export default function DrawingBoard({ roomId }) {
    //
    const socket = useSocket()
    //
    const canvasRef = useRef()

    const [canvasOffset, setCanvasOffset] = useState({
        X: 0, Y: 0
    })

    const [pathElements, setPathElements] = useState([])

    const [currentPathColor, setCurrentPathColor] = useState('#000000')
    const [currentPathWidth, setCurrentPathWidth] = useState(10)
    const [currentPathPoints, setCurrentPathPoints] = useState([])

    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {

        const handleResize = () => {
            const rect = canvasRef.current.getBoundingClientRect()
            setCanvasOffset({
                X: rect.left + window.scrollX,
                Y: rect.top + window.scrollY
            })
            //console.log(canvasOffset.X)
            //console.log(canvasOffset.Y)
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        const updatePaths = (newPathData) => {
            let newPathElement
            if (newPathData.path.length === 0) return
            if (newPathData.path.length === 1) {
                newPathElement = React.createElement("circle", {
                    key: `stroke-${pathElements.length}`,
                    id: `stroke-${pathElements.length}`,
                    cx: newPathData.path[0].x,
                    cy: newPathData.path[0].y,
                    r: newPathData.width / 2,
                    stroke: newPathData.color,
                    fill: newPathData.color
                })
            } else {
                let d = newPathData.path.reduce(function (acc, point, i, a) {
                    return i === 0 ? "M " + point.x + "," + point.y : acc + " " + bezierCommand(point, i, a);
                }, '')
                newPathElement = React.createElement('path', {
                    key: `stroke-${pathElements.length}`,
                    id: `stroke-${pathElements.length}`,
                    fill: "none",
                    d: d,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    stroke: newPathData.color,
                    strokeWidth: newPathData.width
                })
            }

            setPathElements(prevPathElements => [...prevPathElements, newPathElement])
        }

/*         const onUndo = () => {
            setPathElements(prevPathElements => [...prevPathElements].slice(0, prevPathElements.length - 1))
        } */
    
        const onReset = () => {
            setPathElements([])
        }

        socket.on('recieve_paths', updatePaths)
        //socket.on('receive_undo', onUndo)
        socket.on('receive_reset', onReset)

        return () => {
            window.removeEventListener('resize', handleResize)

            socket.off('recieve_paths', updatePaths)
            //socket.off('receive_undo', onUndo)
            socket.off('receive_reset', onReset)
        }
    }, [])

    useEffect(() => {
        const draw = () => {
            if (currentPathPoints.length === 0) return
            if (currentPathPoints.length === 1) {
                setPathElements(prevPathElements => [...prevPathElements, React.createElement("circle", {
                    key: `stroke-${pathElements.length}`,
                    id: `stroke-${pathElements.length}`,
                    cx: currentPathPoints[0].x,
                    cy: currentPathPoints[0].y,
                    r: currentPathWidth / 2,
                    stroke: currentPathColor,
                    fill: currentPathColor
                })])
            } else {
                let d = currentPathPoints.reduce(function (acc, point, i, a) {
                    return i === 0 ? "M " + point.x + "," + point.y : acc + " " + bezierCommand(point, i, a);
                }, '')

                setPathElements(prevPathElements => {
                    prevPathElements[prevPathElements.length - 1] = React.createElement('path', {
                        key: `stroke-${pathElements.length - 1}`,
                        id: `stroke-${pathElements.length - 1}`,
                        fill: "none",
                        d: d,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        stroke: currentPathColor,
                        strokeWidth: currentPathWidth
                    })
                    return prevPathElements
                })
            }
        }
        draw()

        return () => {

        }
    }, [currentPathPoints])


    const handleMouseDown = (e) => {
        setIsDrawing(true)
        //console.log('handleMouseDown')

        const currentPoint = {
            x: e.clientX - canvasOffset.X + window.scrollX,
            y: e.clientY - canvasOffset.Y + window.scrollY
        }

        setCurrentPathPoints(prevPathPoints => [...prevPathPoints, currentPoint])
    }

    const handleMouseUp = (e) => {
        //console.log('handleMouseUp')
        setIsDrawing(false)

        const newPathData = {
            color: currentPathColor,
            width: currentPathWidth,
            path: currentPathPoints
        }

        socket.emit('sending_paths', {
            roomId: roomId,
            pathData: newPathData
        })


        setCurrentPathPoints([])
    }

    const handleMouseMove = (e) => {
        if (!isDrawing) return
        //console.log('handleMouseMove')

        const currentPoint = {
            x: e.clientX - canvasOffset.X + window.scrollX,
            y: e.clientY - canvasOffset.Y + window.scrollY
        }

        if (currentPathPoints.length < 100) {
            setCurrentPathPoints(prevPathPoints => [...prevPathPoints, currentPoint])
        } else {
            const newPathData = {
                color: currentPathColor,
                width: currentPathWidth,
                path: currentPathPoints
            }
            socket.emit('sending_paths', {
                roomId: roomId,
                pathData: newPathData
            })
            setCurrentPathPoints([currentPoint])
        }

    }

/*     const undo = () => {
        socket.emit('sending_undo', {
            roomId: roomId
        })
    } */

    const reset = () => {
        socket.emit('sending_reset', {
            roomId: roomId
        })
    }

    return (
        <>
            <div role="presentation" id="canvas-container" touch-action="none" style={{ touchAction: 'none', width: '100%', height: '100%', border: '0.0625rem solid rgb(156, 156, 156)', aspectRatio: '1.6 / 1', maxWidth: '800px', minWidth: '800px' }}>
                <svg
                    version="1.1"
                    baseProfile="full"
                    xmlns="http://www.w3.org/2000/svg"
                    id="sketch-canvas"
                    style={{ width: '100%', height: '100%' }}
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <g id="background-group">
                        <rect id="sketch-canvas__canvas-background" x="0" y="0" width="100%" height="100%" fill="white"></rect>
                    </g>
                    <g id="stroke-group">
                        {pathElements.map(pathElement => (
                            pathElement
                        ))}
                    </g>
                </svg>
            </div>
            <div>
                <button onClick={reset}>Reset</button>
                <input type='color' value={currentPathColor} onChange={(e) => setCurrentPathColor(e.target.value)} />
                <input type='range' value={currentPathWidth} onChange={(e) => setCurrentPathWidth(e.target.value)} min='4' max='40' />
            </div>
        </>
    )
}
