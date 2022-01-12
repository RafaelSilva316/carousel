import "./styles.css";

//select arrows and slide div
const leftBtn = document.querySelector(".left-arrow");
const rightBtn = document.querySelector(".right-arrow");
const slide = document.querySelector(".slide");
const navDots = document.querySelector(".nav-dots");

//import images into images object
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(require.context("./img", false, /\.(png|jpe?g|svg)$/));

//array for referring to only url srcs
let imgList = Object.values(images);

//keeps track of which image in the array we are looking at
let imgPointer = 0;
let currPos = 0;
let navChildren = [];

for (let i = 0; i < imgList.length; i++) {
  let newImg = new Image();
  newImg.src = imgList[i];
  slide.appendChild(newImg);
  let circle = document.createElement("div");
  circle.classList.add("navdot");
  circle.setAttribute("data-id", i);
  navDots.appendChild(circle);
  navChildren.push(circle);
}

navChildren[0].classList.toggle("active");

//will update the pointer index
const updatePointers = function (imgPointer, imgList, change) {
  if (imgPointer === 0 && change === -1) {
    imgPointer = imgList.length;
  }

  if (imgPointer === imgList.length - 1 && change === 1) {
    imgPointer = -1;
  }

  imgPointer = imgPointer + change;
  return imgPointer;
};

const showDiffPic = function (change) {
  navChildren[imgPointer].classList.toggle("active");
  currPos = currPos + 600 * -change;

  if (currPos == -600 * imgList.length) {
    currPos = 0;
  }
  if (currPos > 0) {
    currPos = -600 * (imgList.length - 1);
  }

  slide.style.left = `${currPos}px`;
  imgPointer = updatePointers(imgPointer, imgList, change);
  navChildren[imgPointer].classList.toggle("active");
};

const showNext = function () {
  showDiffPic(1);
  carouselTimer = resetTimer(carouselTimer);
};

const showPrev = function () {
  showDiffPic(-1);
  carouselTimer = resetTimer(carouselTimer);
};

leftBtn.addEventListener("click", showPrev);
rightBtn.addEventListener("click", showNext);

for (const dot of navChildren) {
  dot.addEventListener("click", () => {
    let dotId = dot.getAttribute("data-id");

    let change = dotId - imgPointer;
    showDiffPic(change);
    carouselTimer = resetTimer(carouselTimer);
  });
}

const resetTimer = function (timer) {
  clearInterval(timer);
  return setInterval(showDiffPic, 5000, 1);
};

let carouselTimer = setInterval(showDiffPic, 5000, 1);
