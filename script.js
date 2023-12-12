const routeAPI =
  "https://rt.data.gov.hk/v2/transport/nlb/route.php?action=list";
// call elements
const submitBtn = document.querySelector("#submit");
const busNumber = document.querySelector("#busNumber");
const dataContainer = document.querySelector(".dataContainer");
const data2Container = document.querySelector("#data2Container");
const btnContainer = document.querySelector("#btnContainer");
const buttons = [];
const dataTime = [];
const timeContainer = document.querySelector("#timeContainer");
const stopNameDiv = document.querySelector("#stopNameDiv");

submitBtn.addEventListener("click", () => {
  btnContainer.innerHTML = "";
  buttons.length = 0;
  let userInput = busNumber.value; // 賦值應該在這裡進行
  fetchData(userInput);
});

const fetchData = async (userInput) => {
  const res = await fetch(routeAPI);
  const result = await res.json();

  for (let key in result.routes) {
    if (userInput === result.routes[key].routeNo) {
      const routeId = result.routes[key].routeId; // 从 result 中提取 routeId
      const routeSCName = result.routes[key].routeName_c; // 假设你想要中文名称
      genButton(routeId, routeSCName);

      //buttons.push(routeSCName); // 直接将字符串模板推入数组
      // 不要在这里执行 forEach
    }
  }

  /*   buttons.forEach((button) => {
    genButton(button); 
  });
  */
};

// genButton 函数的实现，假设它将按钮添加到 btnContainer 中
function genButton(routeId, routeSCName) {
  console.log(routeId, routeSCName);
  //console.log(routeSCName);
  const boundBtn = document.createElement("button");

  boundBtn.setAttribute("routeId", routeId);
  boundBtn.setAttribute("routeSCName", routeSCName);
  boundBtn.textContent = routeSCName;
  console.log(boundBtn);
  btnContainer.appendChild(boundBtn);

  boundBtn.addEventListener("click", async function () {
    stopNameDiv.innerHTML = "";
    const id = this.getAttribute("routeId");
    await fetchRouteData(id);
  });
}

async function fetchRouteData(id) {
  const res = await fetch(
    `https://rt.data.gov.hk/v2/transport/nlb/stop.php?action=list&routeId=${id}`
  );
  const results = await res.json();
  let resultstop = results.stops;
  console.log(resultstop);
  resultstop.forEach((el) => {
    genStops(el, id);
  });
}

async function genStops(el, id) {
  let stopID = el.stopId;
  let stopName = el.stopName_c;
  const pStopName = document.createElement("p");
  pStopName.innerText = stopName;
  stopNameDiv.appendChild(pStopName);
  const buttonStopName = document.createElement("button");
  buttonStopName.innerText = "到站時間";
  stopNameDiv.appendChild(buttonStopName);
  buttonStopName.addEventListener("click", async function () {
    await fetchTimeData(stopID, id, stopName);
    openModal();
  });
}

function openModal() {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  const modalText = document.getElementById("modalText");

  modal.style.display = "block";

  // 按下 <span> (x)，關閉模態視窗
  span.onclick = function () {
    modal.style.display = "none";
  };

  // 點擊模態視窗外的地方，也能關閉模態視窗
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

async function fetchTimeData(stopID, id, stopName) {
  const res = await fetch(
    `https://rt.data.gov.hk/v2/transport/nlb/stop.php?action=estimatedArrivals&routeId=${id}&stopId=${stopID}&language=en`
  );
  const results = await res.json();

  const datatimeArray = results.estimatedArrivals;

  const modalText = document.getElementById("modalText");
  modalText.innerHTML = "";

  datatimeArray.forEach((el) => {
    const pTime = document.createElement("p");
    pTime.innerText = el.estimatedArrivalTime;
    modalText.appendChild(pTime);
  });
}
