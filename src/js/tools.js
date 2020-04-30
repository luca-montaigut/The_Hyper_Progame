import { GameList } from "./GameList";
import moment from "moment";

const searchGame = () => {
  let search = document.getElementById("findgame").value;
  console.log("Search for =", search);
  if (search == "") {
    search = "?dates=2020-01-01,2021-12-31";
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
            toInsert += `<a href="#?parent_platforms=playstation">${developer.name}</a>\n`;
          });
        }
        creator.innerHTML = toInsert;
      });
  });
};

const platformsIcons = {
  pc: "<i data-id='1' class='fab fa-windows fa-2x mx-2'></i> ",
  playstation: "<i data-id='2' class='fab fa-playstation fa-2x mx-2'></i> ",
  xbox: "<i data-id='3' class='fab fa-xbox fa-2x mx-2'></i> ",
  ios: "<i data-id='4' class='fas fa-mobile-alt fa-2x mx-2' ></i> ",
  android: "<i data-id='8' class='fab fa-android fa-2x mx-2'></i> ",
  mac: "<i data-id='5' class='fab fa-apple fa-2x mx-2'></i>",
  linux: "<i data-id='6' class='fab fa-linux fa-2x mx-2'></i>",
  nintendo:
    "<img data-id='7' src='src/images/icons/switch.svg' alt='' class='mx-2' style='height :2em;'>",
  atari: "<i data-id='9' class='fas fa-ghost fa-2x mx-2'></i>",
  "commodore-amiga": "<i data-id='10' class='fas fa-joystick fa-2x mx-2'></i>",
  sega: "<i data-id='11' class='fas fa-gamepad fa-2x mx-2'></i>",
  "3do": "<i data-id='12' class='fas fa-game-console-handheld fa-2x mx-2'></i>",
  "neo-geo":
    "<i data-id='13' class='fas fa-game-console-handheld fa-2x mx-2'></i>",
  web:
    "<i data-id='14' class='fab fa-internet-explorer fa-2x mr-2 '></i><span><i data-id='14' class='fab fa-firefox fa-2x mx-1'></i><span><i data-id='14' class='fab fa-chrome fa-2x ml-2'></i>",
};

const seePlatform = (e) => {
  console.log(e.target.dataset.id);
  platformId = e.target.dataset.id;
  platform = `?parent_platforms=${platformId}`;
  return GameList(platform);
};

export {
  searchGame,
  showInfo,
  hideInfo,
  convertDate,
  addCreators,
  platformsIcons,
  seePlatform,
};
