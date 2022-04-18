var upHold = false;
var downHold = false;
var leftHold = false;
var rightHold = false;
const g = 9.8;
var a = g * 3;

const btnLaunch = document.getElementById("btn_launch");
const btnTL = document.getElementById("btn_turnl");
const btnTR = document.getElementById("btn_turnr");
const environment = document.getElementById("environment");
btnTL.addEventListener("click", function () {
  arr.forEach((r) => r.setRadian(r.radian - 10));
});
btnTR.addEventListener("click", function () {
  arr.forEach((r) => r.setRadian(r.radian + 10));
});
btnLaunch.addEventListener("click", function () {
  arr.forEach((r) => {
    r.moveFunction.push(() => {
      const e = $(r.e);
      if (!e.hasClass("launched") && e.hasClass("rocket")) {
        e.addClass("launched");
        r.moveFunction.push((r) => {
          r.vy += a * Math.cos((r.radian / 180) * Math.PI);
          r.vx += a * Math.sin((r.radian / 180) * Math.PI);
        });
      }
    });
  });
});
const arr = [];
let rockets = document.querySelectorAll(".environment .rocket");
function rocket(id, e, x = 0, y = 0) {
  this.id = id;
  this.e = e;
  this.x = x;
  this.y = y;
  this.gx = 0;
  this.gy = 0;
  e.style.left = this.x + "px";
  e.style.bottom = this.y + "px";
  this.vx = 0;
  this.vy = 0;
  this.radian = 0;
  this.socket = () => {};
  this.setRadian = (r) => {
    this.radian = r;
    if ($(this.e).hasClass("launched"))
      $(this.e).css("transform", "rotate(" + r + "deg)");
  };
  this.move = () => {
    const x = this.x + this.vx;
    const y = this.y + this.vy;
    this.x = x > 0 ? x : 0;
    this.y = y > 0 ? y : 0;
    if (y <= 0) this.vy = this.vy < 0 ? 0 : this.vy;
    if (x <= 0) this.vx = this.vx < 0 ? 0 : this.vx;
    $(e).animate(
      { left: this.x + "px", bottom: this.y + "px" },
      100,
      "linear",
      () => {}
    );
  };
  this.run = () =>
    new Promise(() => {
      this.moveFunction.forEach((f) => f(this));
      this.move();
      if (this.socket) this.socket(this);
      this.gy = 0;
      this.gx = 0;
    });
  this.moveFunction = [
    (rocket) => {
      rocket.vy -= g;
    },
  ];
  return this;
}
const monitoring = document.getElementById("monitoring");
const temp = document.getElementById("temp-rocket");
$(document).ready(() => {
  document.getElementById("btn_addrk").addEventListener("click", () => {
    const e = temp.cloneNode(true);
    $(e).removeClass("temp");
    e.id = arr.length;
    environment.append(e);
    const monitoringRocket = e.cloneNode(true);
    const span = document.createElement("span");
    monitoringRocket.append(span);
    monitoring.append(monitoringRocket);
    const r = new rocket(arr.length, e, arr.length * 200, 200);
    arr.push(r);
    r.socket = (r) => {
      span.innerHTML = `v : ${Math.round(
        Math.abs(r.vx + r.vy)
      )} | (${Math.round(r.x)},${Math.round(r.y)}) | ${r.radian}`;
      const a = Math.abs(tObject.y - r.y);
      const b = tObject.x - r.x;
      const c = Math.sqrt(a * a + b * b);
      let apl = Math.asin(b / c) * 45;
      if (tObject.y < r.y) {
        apl += 90;

        if (tObject.x < r.x) apl += 180;
      }
      if (a < 0) apl += 180;

      r.setRadian(apl);
      if (
        r.x >= tObject.x - r.vx - 50 &&
        r.x <= tObject.x + r.vx + 50 &&
        r.y >= tObject.y - r.vy - 50 &&
        r.y <= tObject.y + r.vy + 50
      ) {
        r.e.remove();
        monitoringRocket.remove();
        arr.splice(
          arr.findIndex((v) => v.id == r.id),
          1
        );
      }
    };
  });
  $(document).keydown(function (e) {
    switch (e.keyCode) {
      case 37:
        tObject.vx = -50;
        // leftHold = true;
        break;
      case 38:
        upHold = true;
        break;
      case 39:
        tObject.vx = 50;
        //   rightHold = true;
        break;
      case 40:
        downHold = true;
        break;
      default:
        break;
    }
  });
  $(document).keyup(function (e) {
    switch (e.keyCode) {
      case 37:
        tObject.vx = 0;
        //   leftHold = false;
        break;
      case 38:
        upHold = false;
        break;
      case 39:
        tObject.vx = 0;
        // rightHold = false;
        break;
      case 40:
        downHold = false;
        break;
      default:
        break;
    }
  });
  const target = document.getElementById("target-1");
  const tObject = new rocket(-1, target, 1000, 1000);
  tObject.moveFunction.push((r) => (r.vy += g));
  arr.push(tObject);
  //   for (let index = 0; index < rockets.length; index++) {
  //     const e = rockets.item(index);
  //     e.id = index;
  //     const monitoringRocket = e.cloneNode();
  //     const span = document.createElement("span");
  //     monitoringRocket.append(span);
  //     monitoring.append(monitoringRocket);
  //     const r = new rocket(index, e, index * 200, 200);
  //     arr.push(r);
  //     r.socket = (r) => {
  //       span.innerHTML = `v : ${Math.round(
  //         Math.abs(r.vx + r.vy)
  //       )} | (${Math.round(r.x)},${Math.round(r.y)}) | ${r.radian}`;
  //       const a = Math.abs(tObject.y - r.y);
  //       const b = tObject.x - r.x;
  //       const c = Math.sqrt(a * a + b * b);
  //       let apl = Math.asin(b / c) * 45;
  //       if (tObject.y < r.y) {
  //         apl += 90;

  //         if (tObject.x < r.x) apl += 180;
  //       }
  //       if (a < 0) apl += 180;

  //       r.setRadian(apl);
  //       if (
  //         r.x >= tObject.x - r.vx - 50 &&
  //         r.x <= tObject.x + r.vx + 50 &&
  //         r.y >= tObject.y - r.vy - 50 &&
  //         r.y <= tObject.y + r.vy + 50
  //       ) {
  //         monitoringRocket.remove();
  //         r.e.remove();
  //         arr.splice(
  //           arr.findIndex((v) => v.id == r.id),
  //           1
  //         );
  //       }
  //     };
  //   }
  setInterval(() => {
    arr.forEach((r) => {
      r.run();
    });
  }, 100);
  setInterval(() => {
    if (upHold) {
      a += 1;
    }
    if (downHold) {
      a -= 1;
    }
    a = a < 0 ? 0 : a;
    if (leftHold) {
      //   btnTL.click();
    }
    if (rightHold) {
      //   btnTR.click();
    }
  }, 100);
});
