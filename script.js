let currentsong = new Audio();
console.log(currentsong);
// let cindexOfsong;
let cardcontainer = document.querySelector(".cardcontainer");
function convertSecondsToMinutesSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function getsongs(folder) {
  let a = await fetch(`http://127.0.0.1:11124/${folder}/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  // console.log(songs)
  return songs;
}
async function displayalbums() {
  let a = await fetch(`http://127.0.0.1:11124/songs/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;

  let p = div.querySelectorAll("a");
  for (let i = 0; i < p.length; i++) {
    if (p[i].href.includes("/songs/")) {
      //   console.log(e)
      let folder = p[i].href.split("/").slice(-1);
      console.log(folder);
      // get meta data of folder

      let a = await fetch(`http://127.0.0.1:11124/songs/${folder}/info.json`);
      //   console.log(a);
      let response = await a.json();

      //   console.log(response);
      cardcontainer.innerHTML += ` <div id = ${folder} class="card rounded">          
              <img
                class="rounded"
                src="https://i.scdn.co/image/ab676161000051740f0be2054fe9594026a6b843"
                alt="" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
                     </div> `;
    }
  }
}
call();
async function call() {
  await displayalbums();
  document.querySelectorAll(".card").forEach(async function (item) {
    item.addEventListener("click", async function (et) {
      // console.log(et.currentTarget.id)
      let cf = et.currentTarget.id;
      let songs = await getsongs(`songs/${cf}`);
      console.log(songs);
      songplay(songs);
    });
  });
}
//show all the songs in li
async function songplay(songs) {
  let po = document.getElementById("play");
  let songsul = document.querySelector(".songs").querySelector("ul");
  songsul.innerHTML = ""

  const existingItems = songsul.querySelectorAll("li");
  existingItems.forEach(item => {
      item.replaceWith(item.cloneNode(true)); // This removes old event listeners
  });

  for (let index = 0; index < songs.length; index++) {
    songsul.innerHTML += ` <li> ${songs[index]
      .split("/")[5]
      .replaceAll("%20", " ")} </li> `;
  }

  //eventlistener to play song
  document
    .querySelector(".songs")
    .querySelectorAll("li")
    .forEach((item, index) => {
      // console.log(item.innerHTML)
      item.addEventListener("click", function () {
        // let audio = new Audio(songs[index])
        currentsong.src = songs[index];
        console.log("Hello baby i am a king ");
        //  console.log(currentsong.play)
        currentsong.play();
        po.innerHTML = ` <i class="ri-pause-line"></i> `;
        //for showing name of song
        showname(index);
      });
    });
  //function to update song name
  function showname(index1) {
    console.log("hello", index1);
    if (index1 == -1 || index1 == songs.length) {
      document.querySelector(".songinfo").innerHTML = "<p> No more songs </p>";
    } else {
      document.querySelector(".songinfo").innerHTML = ` ${songs[index1]
        .split("/")[5]
        .replaceAll("%20", " ")
        .replace("Copy", " ")} `;
    }
  }
  //eventlistener forplay and pause

  document.getElementById("play");
  po.addEventListener("click", function () {
    if (currentsong.paused) {
      currentsong.play();
      po.innerHTML = ` <i class="ri-pause-line"></i> `;
    } else {
      currentsong.pause();
      po.innerHTML = ` <i class="ri-play-large-fill"></i> `;
    }
  });

  //update time event listener
  currentsong.addEventListener("timeupdate", function () {
    // console.log(currentsong.currentTime , currentsong.duration)
    document.querySelector(
      ".time"
    ).innerHTML = ` ${convertSecondsToMinutesSeconds(
      currentsong.currentTime
    )} / ${convertSecondsToMinutesSeconds(currentsong.duration)} `;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  //eventlistener on  the seekbar
  document.querySelector(".seekbar").addEventListener("click", function (tr) {
    // console.log( (( tr.offsetX) / tr.target.getBoundingClientRect().width)*100 )

    document.querySelector(".circle").style.left =
      (tr.offsetX / tr.target.getBoundingClientRect().width) * 100 + "%";

    currentsong.currentTime =
      (currentsong.duration *
        (tr.offsetX / tr.target.getBoundingClientRect().width) *
        100) /
      100;
  });

  //addevent listener on hamburger
  document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector(".left").style.left = 0 + "%";
  });

  // addevent lsitener to close the hamburger
  document.querySelector(".close").addEventListener("click", function () {
    document.querySelector(".left").style.left = -100 + "%";
  });

  //eventlistener for previous and next
 
  document.querySelector("#leftskip").addEventListener("click", function () {
    console.log(songs.indexOf(currentsong.src));
    let cindexOfsong = songs.indexOf(currentsong.src);
    console.log(cindexOfsong);
    currentsong.src = songs[cindexOfsong - 1];
    currentsong.play();
    //showname
    showname(cindexOfsong - 1);
  });

  document.querySelector("#rightskip").addEventListener("click", function () {
    console.log(songs.indexOf(currentsong.src));
    let cindexOfsong = songs.indexOf(currentsong.src);
    currentsong.src = songs[cindexOfsong + 1];
    currentsong.play();
    showname(cindexOfsong + 1);
  });
  document
    .querySelector(".cardcontainer")
    .addEventListener("click", function () {
      document.querySelector(".left").style.left = -100 + "%";
    });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", function (et) {
      // console.log(et.target.value) // gives values from 1 to 100
      //in audio sound is from 0 to 1
      currentsong.volume = et.target.value / 100;
    });
  let vicon = document.querySelector(".volume");
  vicon.addEventListener("click", function () {
    if (currentsong.volume != 0) {
      currentsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
      vicon.innerHTML = ` <i class="ri-volume-mute-line"></i> `;
    } else {
      currentsong.volume = 1;
      vicon.innerHTML = ` <i class="ri-volume-up-line"></i> `;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 100;
    }
  });
}
