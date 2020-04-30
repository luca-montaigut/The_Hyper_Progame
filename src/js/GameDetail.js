import {
  searchGame,
  showInfo,
  hideInfo,
  convertDate,
  addCreators,
  platformsIcons,
  storeIcons,
  seePlatform,
} from "./tools";
import { header, footer } from "./components";

const GameDetail = (argument) => {
  const preparePage = () => {
    let cleanedArgument;
    cleanedArgument = argument.replace(/\s+/g, "-");

    const fetchSimilar = (url) => {
      let similarGames = "";
      fetch(`${url}`)
        .then((response) => response.json())
        .then((response) => {
          for (let i = 0; i < 6; i++) {
            let game = response.results[i];
            let platforms = "";
            if (game.parent_platforms) {
              game.parent_platforms.forEach((platform) => {
                platforms += platformsIcons[platform.platform.slug];
              });
            }
            let genres = "";
            if (game.genres) {
              game.genres.forEach((genre) => {
                genres += " " + genre.name;
              });
            }
            similarGames += `
                  <div class='cardGame card text-white h-100 col-lg-4'>
                    <img src="${
                      game.background_image
                    }" class="cover card-img-top" alt="${game.name}-cover">
                    <div class="game-infos card-img-top not-visible">
                      <h3>${convertDate(game.released)}</h3>
                      <h3 class="creators">${game.slug}</h3>
                      <p>${game.rating}/5 - ${game.ratings_count} votes</p>
                      <p>${genres}</p>
                    </div>
                    <div class="card-body">
                      <h2><a href = "#gamedetail/${
                        game.slug
                      }"class="card-title">${game.name}</a></h2>
                    </div>
                    <div class="card-footer">
                      <p>${platforms}</p>
                    </div>
                  </div>
                `;
          }
          document.querySelector(".similar").innerHTML = similarGames;
          document.querySelectorAll(".cover").forEach((img) => {
            img.addEventListener("mouseover", showInfo);
          });
          document.querySelectorAll(".game-infos").forEach((img) => {
            img.addEventListener("mouseleave", hideInfo);
          });
          addCreators();
          document.querySelectorAll(".card-footer p").forEach((footer) => {
            for (let i = 0; i < footer.children.length; i++) {
              footer.children[i].addEventListener("click", seePlatform);
            }
          });
        });
    };

    const fetchScreenshots = (url) => {
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          let screenshots = response.results;
          document.getElementById("screenshot").innerHTML = `
        <div class="col-6 text-center px-2 my-2"><img src="${screenshots[0].image}" alt="screenshot-1"></div>
        <div class="col-6 text-center px-2 my-2"><img src="${screenshots[1].image}" alt="screenshot-2"></div>
        <div class="col-6 text-center px-2 my-2"><img src="${screenshots[2].image}" alt="screenshot-3"></div>
        <div class="col-6 text-center px-2 my-2"><img src="${screenshots[3].image}" alt="screenshot-4"></div>`;
        });
    };

    const fetchYoutube = (url) => {
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          let toInsertYoutube = "";

          if (response.results[0]) {
            toInsertYoutube += `
            <div class="col-lg-6 text-center mb-3">
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/${
              response.results[0].external_id
            }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="col-lg-6 text-center">
            <h3>${response.results[0].name}</h3>
            <h4>${response.results[0].channel_title} - ${convertDate(
              response.results[0].created
            )}</h4>
            </div>
            `;
          }

          document.getElementById("youtube").innerHTML = toInsertYoutube;

          let toInsertYoutubeMini = "";
          for (let i = 1; i <= 3; i++) {
            if (response.results[i]) {
              toInsertYoutubeMini += `
              <div class="col-lg-4 text-center">
              <div class="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${
                response.results[i].external_id
              }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              <h3>${response.results[i].name}</h3>
              <h4>${response.results[i].channel_title} - ${convertDate(
                response.results[i].created
              )}</h4>
              </div>
              `;
            }
          }
          document.getElementById(
            "youtube-mini"
          ).innerHTML = toInsertYoutubeMini;
        });
    };

    const fetchGame = (url, argument) => {
      let finalURL = url + argument;

      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          let {
            background_image,
            website,
            name,
            rating,
            ratings_count,
            released,
            description,
            developers,
            platforms,
            publishers,
            genres,
            tags,
            stores,
            clip,
            screenshots_count,
            slug,
          } = response;

          if (background_image) {
            document.querySelector(
              ".jumbotron"
            ).style.backgroundImage = `url(${background_image})`;
          }

          if (website) {
            document.querySelector(".jumbotron").innerHTML = `
            <a id="website" href="${website}" class="button d-flex flex-row justify-content-between">
              <p>Check website</p><i class="fas fa-play"></i>
            </a>`;
          }

          if (name) {
            document.getElementById("title").innerHTML = name;
          } else {
            document.getElementById("title").innerHTML = "No data on this";
          }

          if (rating && ratings_count) {
            document.getElementById(
              "rating"
            ).innerHTML = `${rating}/5 - ${ratings_count} votes`;
          } else {
            document.getElementById("rating").innerHTML = "No data on this";
          }

          if (description) {
            document.getElementById("description").innerHTML = description;
          } else {
            document.getElementById("description").innerHTML =
              "No data on this";
          }

          if (released) {
            document.querySelector(".release").innerHTML = convertDate(
              released
            );
          } else {
            document.querySelector(".release").innerHTML = "No data on this";
          }

          if (developers) {
            let toInsertDevelopers = "";
            developers.forEach((developer) => {
              toInsertDevelopers += `<a class="studio" data-id="${developer.id}">${developer.name}</a><br>`;
            });
            document.querySelector(
              ".developers"
            ).innerHTML = toInsertDevelopers;
          } else {
            document.querySelector(".developers").innerHTML = "No data on this";
          }

          if (platforms) {
            let toInsertPlatforms = "";
            platforms.forEach((platform) => {
              toInsertPlatforms += platform.platform.name + "\n";
            });
            document.querySelector(".platforms").innerHTML = toInsertPlatforms;
          } else {
            document.querySelector(".platforms").innerHTML = "No data on this";
          }

          if (publishers) {
            let toInsertPublishers = "";
            publishers.forEach((publisher) => {
              toInsertPublishers += publisher.name + "<br>";
            });
            document.querySelector(
              ".publishers"
            ).innerHTML = toInsertPublishers;
          } else {
            document.querySelector(".publishers").innerHTML = "No data on this";
          }

          if (genres) {
            let toInsertGenres = "";
            genres.forEach((genre) => {
              toInsertGenres += genre.name + " ";
            });
            document.querySelector(".genres").innerHTML = toInsertGenres;
          } else {
            document.querySelector(".genres").innerHTML = "No data on this";
          }

          if (tags) {
            let toInsertTags = "";
            tags.forEach((tag) => {
              toInsertTags += tag.name + " ";
            });
            document.querySelector(".tags").innerHTML = toInsertTags;
          } else {
            document.querySelector(".tags").innerHTML = "No data on this";
          }

          if (stores) {
            let toInsertStores = "";
            stores.forEach((store) => {
              toInsertStores += `<a href="${store.url}">${
                store.store.name
              }  </a>${storeIcons[store.store.slug]}<br>`;
            });
            document.querySelector(".stores").innerHTML = toInsertStores;
          } else {
            document.querySelector(".stores").innerHTML = "No data on this";
          }

          if (screenshots_count > 0) {
            fetchScreenshots(
              `https://api.rawg.io/api/games/${slug}/screenshots`
            );
          }

          if (clip) {
            document.querySelector(".trailer").innerHTML = `
            <video controls width="100%">      
              <source src="${clip.clip}"
                      type="video/mp4">
              Sorry, your browser doesn't support embedded videos.
            </video>`;
          } else {
            document.querySelector(".trailer").innerHTML = "No data on this";
            document.getElementById("youtube").innerHTML =
              "<p>No data on this<p>";
          }

          fetchYoutube(`https://api.rawg.io/api/games/${slug}/youtube`);

          fetchSimilar(`https://api.rawg.io/api/games/${slug}/suggested`);
        });
    };

    fetchGame("https://api.rawg.io/api/games/", cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
      ${header()}

      <div class="jumbotron">
      </div>
  
      <header>
          <div class="row d-flex justify-content-between align-items-end">
            <div class="col-lg-6 d-flex flex-row">
            <h1 id="title">...loading</h1>
            </div>
            <div class="col-lg-6 d-flex flex-row-reverse">
            <h2 id="rating">...loading</h2>
            </div>
          </div>
          <p id="description">...loading</p>
      </header>
      <section class="game-detail">
        <br>
        <div class="row">
          <div class="col">
            <h3>Release</h3>
            <p class="release">...loading</p>
          </div>
          <div class="col">
            <h3>Developer</h3>
            <p class="developers">...loading</p>
          </div>
          <div class="col">
            <h3>Platforms</h3>
            <p class="platforms">...loading</p>
          </div>
          <div class="col">
            <h3>Publishers</h3>
            <p class="publishers">...loading</p>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <h3>Genre</h3>
            <p class="genres">...loading</p>
          </div>
          <div class="col">
            <h3>Tags</h3>
            <p class="tags">...loading</p>
          </div>
        </div>
        <br>
        <div>
          <h2 class="my-5">BUY</h2>
          <p class="stores">...loading</p>
        </div>
        <div>
          <h2 class="my-5">TRAILER</h2>
          <p class="trailer">...loading</p>
        </div>
        <div>
          <h2 class="my-5">SCREENSHOTS</h2>
          <div id="screenshot" class="row"></div>
        </div>
        <div>
          <h2 class="my-5">YOUTUBE</h2>
          <div id="youtube" class="row">...loading</div>
          <div id="youtube-mini" class="row"></div>
        </div>
        <div>
          <h2 class="my-5">SIMILAR GAMES</h2>
          <p class="similar row">...loading</p>
        </div>
      </section>
      
    ${footer()}
    `;

    document
      .querySelector(".form-control")
      .addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
          searchGame();
        }
      });

    preparePage();
  };

  render();
};

export { GameDetail };
