document.addEventListener("DOMContentLoaded", function () {
  const rssUrl = "https://www.ximalaya.com/album/72549254.xml";
  const podcastEpisodesContainer = document.querySelector(".podcast-episodes");

  fetch(rssUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      items.forEach((item) => {
        const title = item.querySelector("title").textContent;
        const pubDate = item.querySelector("pubDate").textContent;
        const duration =
          item.getElementsByTagName("itunes:duration")[0].textContent;
        const enclosure = item.querySelector("enclosure").getAttribute("url");
        const descriptionHtml = item.querySelector("description").textContent;

        const descriptionElement = document.createElement("div");
        descriptionElement.innerHTML = descriptionHtml;
        const descriptionText =
          descriptionElement.textContent || descriptionElement.innerText || "";

        const episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode");

        const dateDurationDiv = document.createElement("div");
        dateDurationDiv.classList.add("date-duration");

        const dateElement = document.createElement("p");
        dateElement.classList.add("date");
        dateElement.textContent = new Date(pubDate).toLocaleDateString();

        const durationElement = document.createElement("p");
        durationElement.classList.add("duration");
        durationElement.textContent = duration;

        dateDurationDiv.appendChild(dateElement);
        dateDurationDiv.appendChild(durationElement);

        const titlePlayDiv = document.createElement("div");
        titlePlayDiv.classList.add("title-play");

        const titleElement = document.createElement("a");
        titleElement.classList.add("title");
        titleElement.href = enclosure;
        titleElement.textContent = title;

        const playButton = document.createElement("button");
        playButton.classList.add("play-button");
        playButton.innerHTML = "&#9658;"; // Play icon

        const descriptionParagraph = document.createElement("p");
        descriptionParagraph.classList.add("description");
        descriptionParagraph.textContent = descriptionText;

        const progressBarContainer = document.createElement("div");
        progressBarContainer.classList.add("progress-bar-container");

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");

        const progress = document.createElement("div");
        progress.classList.add("progress");
        progressBar.appendChild(progress);

        progressBarContainer.appendChild(progressBar);

        titlePlayDiv.appendChild(playButton);
        titlePlayDiv.appendChild(titleElement);

        const audio = new Audio(enclosure);

        playButton.addEventListener("click", () => {
          if (playButton.classList.contains("playing")) {
            playButton.classList.remove("playing");
            playButton.innerHTML = "&#9658;"; // Play icon
            audio.pause();
          } else {
            playButton.classList.add("playing");
            playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
            audio.play();
            progressBarContainer.style.display = "block"; // 显示进度条容器
            updateProgressBar();
          }
        });

        titleElement.addEventListener("click", (event) => {
          event.preventDefault();
          if (playButton.classList.contains("playing")) {
            playButton.classList.remove("playing");
            playButton.innerHTML = "&#9658;"; // Play icon
            audio.pause();
          } else {
            playButton.classList.add("playing");
            playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
            audio.play();
            progressBarContainer.style.display = "block"; // 显示进度条容器
            updateProgressBar();
          }
        });

        progressBar.addEventListener("click", (e) => {
          const rect = progressBar.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const newTime = (offsetX / progressBar.offsetWidth) * audio.duration;
          audio.currentTime = newTime;
        });

        audio.addEventListener("timeupdate", () => {
          const progressPercentage = (audio.currentTime / audio.duration) * 100;
          progress.style.width = progressPercentage + "%";
        });

        audio.addEventListener("ended", () => {
          playButton.classList.remove("playing");
          playButton.innerHTML = "&#9658;"; // Play icon
          progressBarContainer.style.display = "none"; // 隐藏进度条容器
        });

        function updateProgressBar() {
          if (audio.currentTime > 0 && audio.duration) {
            progress.style.width =
              (audio.currentTime / audio.duration) * 100 + "%";
            if (!audio.paused) {
              requestAnimationFrame(updateProgressBar);
            }
          }
        }

        episodeDiv.appendChild(dateDurationDiv);
        episodeDiv.appendChild(titlePlayDiv);
        episodeDiv.appendChild(descriptionParagraph);
        episodeDiv.appendChild(progressBarContainer);

        podcastEpisodesContainer.appendChild(episodeDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching RSS feed:", error);
    });
});
