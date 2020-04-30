import { GameList } from "./GameList";
import moment from "moment";

const getHomeDefault = () => {
  let d = new Date();
  let day = d.getDate();
  if (day < 10) {
    day = "0" + String(day);
  }
  let month = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + String(month);
  }
  let now = `${d.getFullYear()}-${month}-${day}`;
  let trueDay = day;
  if (trueDay > 28) {
    trueDay = 28;
  }
  let nextYear = `${d.getFullYear() + 1}-${month}-${trueDay}`;
  return `?dates=${now},${nextYear}&ordering=-added`;
};

const searchGame = () => {
  let search = document.getElementById("findgame").value;
  console.log("Search for =", search);
  if (search == "") {
    search = getHomeDefault();
  } else {
    search = "?search=" + search;
  }
  return GameList(search);
};

const showInfo = (e) => {
  e.target.classList.add("not-visible");
  e.target.nextElementSibling.classList.remove("not-visible");
};

const hideInfo = (e) => {
  e.target.classList.add("not-visible");
  e.target.previousElementSibling.classList.remove("not-visible");
};

const convertDate = (date) => {
  return moment(date).format("MMMM Do YYYY");
};

const addCreators = () => {
  let creators = document.querySelectorAll(".creators");
  creators.forEach((creator) => {
    let slug = creator.innerHTML;
    fetch(`https://api.rawg.io/api/games/${slug}`)
      .then((response) => response.json())
      .then((response) => {
        let toInsert = "";
        if (response.developers) {
          response.developers.forEach((developer) => {
            toInsert += `<a class="studio" data-id="${developer.id}">${developer.name}</a><br>`;
          });
        }
        creator.innerHTML = toInsert;
      });
  });
  setTimeout(() => {
    document.querySelectorAll(".studio").forEach((link) => {
      link.addEventListener("click", seeStudio);
    });
  }, 1000);
};

const platformsIcons = {
  pc:
    "<img data-id='1' src='src/images/icons/windows.svg' alt='' class='mx-2' style='height :2em;'>",
  playstation:
    "<img data-id='2' src='src/images/icons/ps4.svg' alt='' class='mx-2' style='height :2em;'>",
  xbox:
    "<img data-id='3' src='src/images/icons/xbox.svg' alt='' class='mx-2' style='height :2em;'>",
  ios:
    "<img data-id='4' src='src/images/icons/mobile.svg' alt='' class='mx-2' style='height :2em;'>",
  android:
    "<img data-id='8' src='src/images/icons/androi.svg' alt='' class='mx-2' style='height :2em;'>",
  mac:
    "<img data-id='5' src='src/images/icons/apple.svg' alt='' class='mx-2' style='height :2em;'>",
  linux:
    "<img data-id='6' src='src/images/icons/linux.svg' alt='' class='mx-2' style='height :2em;'>",
  nintendo:
    "<img data-id='7' src='src/images/icons/switch.svg' alt='' class='mx-2' style='height :2em;'>",
  atari:
    "<img data-id='9' src='src/images/icons/ghost-solid.svg' alt='' class='mx-2' style='height :2em;'>",
  "commodore-amiga":
    "<img data-id='10' src='src/images/icons/ghost-solid.svg' alt='' class='mx-2' style='height :2em;'>",
  sega:
    "<img data-id='11' src='src/images/icons/ghost-solid.svg' alt='' class='mx-2' style='height :2em;'>",
  "3do":
    "<img data-id='12' src='src/images/icons/ghost-solid.svg' alt='' class='mx-2' style='height :2em;'>",
  "neo-geo":
    "<img data-id='13' src='src/images/icons/ghost-solid.svg' alt='' class='mx-2' style='height :2em;'>",
  web:
    "<img data-id='14' src='src/images/icons/ie.svg' alt='' class='mx-2' style='height :2em;'><img data-id='14' src='src/images/icons/firefox.svg' alt='' class='mx-2' style='height :2em;'><img data-id='14' src='src/images/icons/chrome.svg' alt='' class='mx-2' style='height :2em;'>",
};

const storeIcons = {
  steam:
    "<img data-id='1' src='src/images/icons/steam.svg' alt='' class='mx-2' style='height :2em;'>",
  "playstation-store":
    "<img data-id='2' src='src/images/icons/ps4.svg' alt='' class='mx-2' style='height :2em;'>",
  "xbox-store":
    "<img data-id='3' src='src/images/icons/xbox.svg' alt='' class='mx-2' style='height :2em;'>",
  "apple-appstore":
    "<img data-id='4' src='src/images/icons/applestore.svg' alt='' class='mx-2' style='height :2em;'>",
  gog:
    "<img data-id='5' src='src/images/icons/gog.svg' alt='' class='mx-2' style='height :2em;'>",
  nintendo:
    "<img data-id='6' src='src/images/icons/switch.svg' alt='' class='mx-2' style='height :2em;'>",
  xbox360:
    "<img data-id='7' src='src/images/icons/xbox.svg' alt='' class='mx-2' style='height :2em;'>",
  "google-play":
    "<img data-id='8' src='src/images/icons/googleplay.svg' alt='' class='mx-2' style='height :2em;'>",
  itch:
    "<img data-id='9' src='src/images/icons/itch.svg' alt='' class='mx-2' style='height :2em;'>",
  "epic-games":
    "<img data-id='10' src='src/images/icons/epic.svg' alt='' class='mx-2' style='height :2em;'>",
};

const seePlatform = (e) => {
  let platformId = e.target.dataset.id;
  let platform = `?parent_platforms=${platformId}`;
  return GameList(platform);
};

const seeStudio = (e) => {
  console.log(e);
  console.log(e.target.dataset.id);
  let studioId = e.target.dataset.id;
  let studio = `?developers=${studioId}`;
  return GameList(studio);
};

export {
  getHomeDefault,
  searchGame,
  showInfo,
  hideInfo,
  convertDate,
  addCreators,
  platformsIcons,
  storeIcons,
  seePlatform,
  seeStudio,
};
