export default class Pointer {
  size = 0;
  hashMap = {};
  pointerId: string;
  pos1: {
    x: number;
    y: number;
  };
  pos0: {
    x: number;
    y: number;
  };
  isClicked: boolean;

  constructor(pointerId) {
    this.pointerId = pointerId;
    this.pos1 = {
      x: -1,
      y: -1,
    };
    this.pos0 = {
      x: -1,
      y: -1,
    };
    this.isClicked = false;

    this.addPointer(this);
  }

  get(pointerId) {
    return this.hashMap[pointerId];
  }

  destruct(pointerId) {
    this.removePointer(pointerId);
  }

  addPointer(pointer) {
    this.hashMap[pointer.pointerId] = pointer;
    this.size += 1;
  }

  removePointer(pointerId) {
    if (this.hashMap[pointerId]) {
      delete this.hashMap[pointerId];
      this.size -= 1;
      if (this.size == 0 && this.onEmpty) {
        this.onEmpty();
      }
    }
  }

  onEmpty() {
    return;
  }

  release() {
    this.isClicked = false;
    this.pos0.y = -1;
    this.pos0.x = -1;
  }

  set(pos) {
    this.pos1.x = pos.x;
    this.pos1.y = pos.y;
  }
}
