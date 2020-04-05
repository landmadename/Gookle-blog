import { Controller } from "react-spring";

export function createStick() {
    const stick = []
    return stick
}

export function createHaw(box, position, id, url, face, from) {
    this.box = box
    this.position = position
    this.id = id
    this.url = url
    this.face = face
    this.spring = new Controller({ from })
    this.set = (to) => {
        this.spring.update(to).start();
    }
}