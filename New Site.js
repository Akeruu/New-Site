document.addEventListener("DOMContentLoaded", function () {
  fetch("https://www.ximalaya.com/album/72549254.xml")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      let parser = new DOMParser();
      let xml = parser.parseFromString(data, "application/xml");
      let channel = xml.querySelector("channel");
      if (!channel) {
        throw new Error("Invalid XML format: <channel> element not found");
      }

      // Modify here to handle fetching podcast image
      let podcastImage = "";
      let imageNode = channel.querySelector("image");
      if (imageNode && imageNode.querySelector("url")) {
        podcastImage = imageNode.querySelector("url").textContent;
      }

      let podcastTitle = channel.querySelector("title")
        ? channel.querySelector("title").textContent
        : "Podcast Title Not Found";

      let items = xml.querySelectorAll("item");
      let episodesContainer = document.getElementById("podcast-episodes");

      items.forEach((item) => {
        let title = item.querySelector("title")
          ? item.querySelector("title").textContent
          : "Episode Title Not Found";
        let enclosure = item.querySelector("enclosure");
        let audioUrl = enclosure ? enclosure.getAttribute("url") : "";

        let episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode");

        let episodeTitle = document.createElement("h3");
        episodeTitle.textContent = title;
        episodeDiv.appendChild(episodeTitle);

        if (audioUrl) {
          let audioPlayer = document.createElement("audio");
          audioPlayer.controls = true;
          audioPlayer.src = audioUrl;
          episodeDiv.appendChild(audioPlayer);
        }

        episodesContainer.appendChild(episodeDiv);
      });

      // Display podcast title and image
      let podcastInfoContainer = document.getElementById("podcast-info");

      // Display podcast image
      if (podcastImage) {
        let podcastImageElem = document.createElement("img");
        podcastImageElem.src = podcastImage;
        podcastInfoContainer.appendChild(podcastImageElem);
      }

      // Display podcast title
      let podcastTitleElem = document.createElement("h2");
      podcastTitleElem.textContent = podcastTitle;
      podcastInfoContainer.appendChild(podcastTitleElem);
    })
    .catch((error) => {
      console.error("Error fetching or parsing RSS feed:", error);
    });
});
