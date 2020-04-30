import {
  getHomeDefault,
  searchGame,
  showInfo,
  hideInfo,
  convertDate,
  addCreators,
  platformsIcons,
  seePlatform,
} from "./tools";
import { header, footer } from "./components";

const GameList = (argument = "") => {
  let hideShow = 0;

  const filteredView = (e) => {
    hideShow = 0;
    document.getElementById("showmore").innerHTML = "";

    let games = document.querySelectorAll(".card");

    document.querySelectorAll(".card").forEach((game) => {
      game.classList.add("not-visible");
    });

    for (let i = 0; i < 27; i++) {
      if (hideShow > 8) {
        document.getElementById(
          "showmore"
        ).innerHTML = `<p class="button">Show more</p>`;
        document.querySelector(".button").addEventListener("click", showMore);
        break;
      }
      if (games[i].classList.contains(e.target.value)) {
        games[i].classList.remove("not-visible");
        hideShow++;
      }
    }
  };

  const showMore = () => {
    let run = hideShow;
    let games = new Array();
    let filter = document.getElementById("platforms");
    document.querySelectorAll(".card").forEach((game) => {
      if (game.classList.contains(filter.value)) {
        games.push(game);
      }
    });
    for (let i = run; i < run + 9; i++) {
      if (!games[i]) {
        document.querySelector(".button").style.display = "none";
        break;
      }
      games[i].classList.remove("not-visible");
      hideShow++;
    }
    if (hideShow >= 27) {
      document.querySelector(".button").style.display = "none";
    }
  };

  const prepareFilter = () => {
    let selectors = "<option value='any'>Platform : Any</option>\n";
    fetch("https://api.rawg.io/api/platforms/lists/parents")
      .then((response) => response.json())
      .then((response) => {
        response.results.forEach((platform) => {
          selectors += `<option value='${platform.slug}'>${platform.name}</option>\n`;
        });
        let filter = document.getElementById("platforms");
        filter.innerHTML = selectors;

        filter.addEventListener("change", filteredView);
      });
  };

  const preparePage = () => {
    let cleanedArgument;
    cleanedArgument = argument.replace(/\s+/g, "-");
    let games = "";

    const fetchList = async (url, argument) => {
      let finalURL = url;
      if (argument) {
        url = "https://api.rawg.io/api/games";
        finalURL = url + argument + "&page_size=30";
      }

      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          response.results.forEach((game) => {
            let platforms = "";
            let filters = "";
            if (game.parent_platforms) {
              game.parent_platforms.forEach((platform) => {
                filters += platform.platform.slug + " ";
                let icon = platformsIcons[platform.platform.slug];
                platforms += icon + " ";
              });
            }
            let genres = "";
            if (game.genres) {
              game.genres.forEach((genre) => {
                genres += " " + genre.name;
              });
            }
            let firstDiv = `<div class='cardGame card text-white h-100 col-lg-4 any ${filters}'>`;
            if (hideShow > 8) {
              firstDiv = `<div class='cardGame card text-white h-100 col-lg-4 any ${filters} not-visible'>`;
            }
            games += `
                  ${firstDiv}
                    <img src="${
                      game.background_image
                    }" class="cover card-img-top" alt="${game.name}-cover">
                    <div class="game-infos card-img-top not-visible">
                      <h3>${convertDate(game.released)}</h3>
                      <h3 class="creators">${game.slug}</h3>
                      <h4>${game.rating}/5 - ${game.ratings_count} votes</h4>
                      <p>${genres}</p>
                    </div>
                    <div class="card-body">
                      <h2><a href = "#gamedetail/${
                        game.slug
                      }"class="card-title">${game.name}</a></h2>
                    </div>
                    <div class="card-footer">
                      <p class="d-flex align-items-center">${platforms}</p>
                    </div>
                  </div>
                `;
            hideShow++;
          });
          document.querySelector(".game-list .games").innerHTML = games;
          document.querySelectorAll(".cover").forEach((img) => {
            img.addEventListener("mouseover", showInfo);
          });
          document.querySelectorAll(".game-infos").forEach((img) => {
            img.addEventListener("mouseleave", hideInfo);
          });
          if (hideShow > 8) {
            document.getElementById(
              "showmore"
            ).innerHTML = `<p class="button">Show more</p>`;
            document
              .querySelector(".button")
              .addEventListener("click", showMore);
          }
          hideShow = 9;
          addCreators();
          document.querySelectorAll(".card-footer p").forEach((footer) => {
            for (let i = 0; i < footer.children.length; i++) {
              footer.children[i].addEventListener("click", seePlatform);
            }
          });
        });
    };

    let dates = getHomeDefault();

    fetchList(
      `https://api.rawg.io/api/games${dates}&page_size=30`,
      cleanedArgument
    );
  };

  const render = () => {
    pageContent.innerHTML = `
      ${header()}

      <header>
        <h1>Welcome,</h1>
        <p>The Hyper Progame is the world's premier event for computer and video games and related products. At The Hyper Progame, the video game industy's top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industy. For three exiting days, leading-edge compagnies, groundbrealing new technologies, and never-before seen products will be showcased. The Hyper Progame connects you with both new and existing partners, industry executives, gamers, and social influencers providing unprecedented exposure</p>
        <div class="box">
          <select id="platforms" name="platformlist">
            <option value="any">Platform : Any</option>
          </select>
        </div>  
      </header>


      <section class="game-list">
        <div class="games row">...loading
        </div>
        <div id="showmore" class="d-flex justify-content-center text-center mb-3">
        </div>
      </section>

      ${footer()}
      <script src="https://code.iconify.design/1/1.0.6/iconify.min.js"></script>
    `;

    document
      .querySelector(".form-control")
      .addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
          searchGame();
        }
      });

    document.querySelector(".fa-search").addEventListener("click", searchGame);

    prepareFilter();
    preparePage();
  };

  render();
};

export { GameList };
