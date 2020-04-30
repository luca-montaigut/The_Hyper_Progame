import {
  searchGame,
  showInfo,
  hideInfo,
  convertDate,
  addCreators,
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
                platforms +=
                  `<i class='fab fa-${platform.platform.slug} fa-2x'></i>` +
                  " ";
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
                    }" class="card-img-top" alt="${game.name}-cover">
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
          document.querySelectorAll(".card img").forEach((img) => {
            img.addEventListener("mouseover", showInfo);
          });
          document.querySelectorAll(".game-infos").forEach((img) => {
            img.addEventListener("mouseleave", hideInfo);
          });
          addCreators();
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

          if (response.items[0]) {
            toInsertYoutube += `
            <div class="col-lg-6 text-center">
            <h3>${response.items[0].snippet.title}</h3>
            <h4>${response.items[0].snippet.channelTitle} - ${convertDate(
              response.items[0].snippet.publishedAt
            )}</h>
            </div>
            `;
          }

          document.getElementById("youtube").innerHTML += toInsertYoutube;
        });
    };

    const fetchYoutubeMini = (url) => {
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          let toInsertYoutubeMini = "";
          for (let i = 0; i <= 2; i++) {
            if (response.items[i]) {
              toInsertYoutubeMini += `
              <div class="col-lg-4 text-center">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${
                response.items[i].id.videoId
              }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <h3>${response.items[i].snippet.title}</h3>
              <h4>${response.items[i].snippet.channelTitle} - ${convertDate(
                response.items[i].snippet.publishedAt
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

          if (name) {
            document.getElementById("title").innerHTML = name;
          }

          if (rating && ratings_count) {
            document.getElementById(
              "rating"
            ).innerHTML = `${rating}/5 - ${ratings_count} votes`;
          }

          if (description) {
            document.getElementById("description").innerHTML = description;
          }

          if (released) {
            document.querySelector(".release").innerHTML = convertDate(
              released
            );
          }

          if (developers) {
            let toInsertDevelopers = "";
            developers.forEach((developer) => {
              toInsertDevelopers += developer.name + "\n";
            });
            document.querySelector(
              ".developers"
            ).innerHTML = toInsertDevelopers;
          }

          if (platforms) {
            let toInsertPlatforms = "";
            platforms.forEach((platform) => {
              toInsertPlatforms += platform.platform.name + "\n";
            });
            document.querySelector(".platforms").innerHTML = toInsertPlatforms;
          }

          if (publishers) {
            let toInsertPublishers = "";
            publishers.forEach((publisher) => {
              toInsertPublishers += publisher.name + "\n";
            });
            document.querySelector(
              ".publishers"
            ).innerHTML = toInsertPublishers;
          }

          if (genres) {
            let toInsertGenres = "";
            genres.forEach((genre) => {
              toInsertGenres += genre.name + " ";
            });
            document.querySelector(".genres").innerHTML = toInsertGenres;
          }

          if (tags) {
            let toInsertTags = "";
            tags.forEach((tag) => {
              toInsertTags += tag.name + " ";
            });
            document.querySelector(".tags").innerHTML = toInsertTags;
          }

          if (stores) {
            let toInsertStores = "";
            stores.forEach((store) => {
              toInsertStores += `<a href="${store.url}">${
                store.store.name
              }  </a><i class='fab fa-${store.store.slug.replace(
                /-store/g,
                ""
              )} fa-2x'></i><br>`;
            });
            document.querySelector(".stores").innerHTML = toInsertStores;
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

            if (clip.video) {
              let youtubeCode = clip.video;
              document.getElementById("youtube").innerHTML = `
              <div class="col-lg-6 text-center mb-3">
              <iframe width="100%" height="500" src="https://www.youtube.com/embed/${youtubeCode}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              `;
              fetchYoutube(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${youtubeCode}&key=AIzaSyD_yEBNYfOB6cG3hJxu6MiG6-tCvZi1d24
              `);
              fetchYoutubeMini(
                `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_yEBNYfOB6cG3hJxu6MiG6-tCvZi1d24&maxResults=5&part=snippet&type=video&relatedToVideoId=${youtubeCode}`
              );
            }
          }

          fetchSimilar(`https://api.rawg.io/api/games/${slug}/suggested`);
        });
    };

    fetchGame("https://api.rawg.io/api/games/", cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
      ${header()}

      <div class="jumbotron">
        <div id="website" href="" class="button d-flex flex-row justify-content-between">
        <p>Check website</p><i class="fas fa-play"></i>
        </div>
      </div>
  
      <header>
          <div class="d-flex justify-content-between align-items-end">
            <h1 id="title"></h1>
            <h2 id="rating"></h2>
          </div>
          <p id="description"></p>
      </header>
      <section class="game-detail">
        <br>
        <div class="row">
          <div class="col">
            <h3>Release</h3>
            <p class="release"></p>
          </div>
          <div class="col">
            <h3>Developer</h3>
            <p class="developers"></p>
          </div>
          <div class="col">
            <h3>Platforms</h3>
            <p class="platforms"></p>
          </div>
          <div class="col">
            <h3>Publishers</h3>
            <p class="publishers"></p>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <h3>Genre</h3>
            <p class="genres"></p>
          </div>
          <div class="col">
            <h3>Tags</h3>
            <p class="tags"></p>
          </div>
        </div>
        <br>
        <div>
          <h2 class="my-5">BUY</h2>
          <p class="stores"></p>
        </div>
        <div>
          <h2 class="my-5">TRAILER</h2>
          <p class="trailer"></p>
        </div>
        <div>
          <h2 class="my-5">SCREENSHOTS</h2>
          <div id="screenshot" class="row"></div>
        </div>
        <div>
          <h2 class="my-5">YOUTUBE</h2>
          <div id="youtube" class="row"></div>
          <div id="youtube-mini" class="row"></div>
        </div>
        <div>
          <h2 class="my-5">SIMILAR GAMES</h2>
          <p class="similar row"></p>
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
