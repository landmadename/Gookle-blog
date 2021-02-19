const debug = 0
const rate = debug === 0? 1:3

const initialState = {
    album: {},
    boxes: {},
    gookles: {},
    wheight: window.innerHeight/rate,
    wwidth: window.innerWidth/rate,
    debug: debug,
    mx: 0,
    level: 0,
    pageUrl: ""
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'pushGookles':
            const boxName = Object.keys(payload)[0]
            let gookles = Object.assign({}, state.gookles)
            const data = payload[boxName]
            let existId = []
            if (gookles[boxName] == null) {
                existId = []
                gookles[boxName] = []
            } else {
                existId = gookles[boxName].map((i) => i.id)
            }
            
            for (let i = 0; i < data.length; i++) {
                if (existId.indexOf(data[i].id)) {
                    gookles[boxName].push(data[i])
                }                
            }
            gookles = {gookles: gookles}
            return Object.assign({}, state, gookles)

        case 'setAlbum':
            return Object.assign({}, state, payload)

        case 'setBoxes':
            return Object.assign({}, state, payload)
    
        case 'Mx':
            return Object.assign({}, state, payload)

        case 'moveDeck':
            let boxes = Object.assign({}, state.boxes)
            // console.log(payload)
            if (payload.dir === "left") {
                Object.keys(boxes).map(box => {
                    if (boxes[box].yIndex === payload.index) {
                        boxes[box].xIndex = boxes[box].xIndex - 1
                    }
                    return 0
                })
            } else if (payload.dir === "right") {
                Object.keys(boxes).map(box => {
                    if (boxes[box].yIndex === payload.index) {
                        boxes[box].xIndex = boxes[box].xIndex + 1
                    }
                    return 0
                })
            } else if (payload.dir === "down") {
                let t = 0
                Object.keys(boxes).map(box => {
                    if (boxes[box].yIndex === 0) {
                        t = boxes[payload.collectionName].yIndex
                        boxes[payload.collectionName].yIndex = boxes[box].yIndex
                        boxes[box].yIndex = t

                        t = boxes[payload.collectionName].xIndex
                        boxes[payload.collectionName].xIndex = 0
                        boxes[box].xIndex = t
                    }
                    return 0
                })
            }
            boxes = {boxes: boxes}
            return Object.assign({}, state, boxes)
        case 'shiftLevel':
            return Object.assign({}, state, {level: payload})
        case 'setPageUrl':
            return Object.assign({}, state, {pageUrl: payload})
        default:
            return state
    }
}
