let postOfficesData;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".detail").style.display = `none`;

  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let IPaddress = data.ip;

      let ipContainer = document.querySelector(".ip-address");
      ipContainer.innerHTML = `Your Current IP Address is <span class='white'>${IPaddress}</span>`;

      fetchUserInfo(IPaddress);
    })
    .catch((error) => {
      console.error("Error:", error);
      document.querySelector(".ip-address").textContent = "Unable to get IP address";
    });

  let searchInput = document.getElementById('search-bar');
  searchInput.addEventListener('input', findPostOffice);
});

function fetchUserInfo(ip) {
  let startBtn = document.querySelector(".btn-submit");
  startBtn.addEventListener("click", function () {
    document.querySelector(".home").style.display = `none`;
    document.querySelector(".detail").style.display = `block`;
  });

  fetch(`https://ipapi.co/${ip}/json/`)
    .then((response) => response.json())
    .then((data) => {
      console.log("User Information:", data);

      let longitude = data.longitude;
      let latitude = data.latitude;

      DisplayUserLocationOnGoogleMap(longitude, latitude);
      postOfficeFound(data.postal);

      let top_detail = document.querySelector(".top-detail");
      let ip2 = document.querySelector(".ip2");

      ip2.innerHTML = `IP Address : <span class="white">${data.ip}</span>`;

      top_detail.innerHTML = `
        <div class="lat-long">
          <p class="top-detail-p">Lat: ${data.latitude}</p>
          <p class="top-detail-p">Long: ${data.longitude}</p>
        </div>
        <div class="city-region">
          <p class="top-detail-p">City: ${data.city}</p>
          <p class="top-detail-p">Region: ${data.region}</p>
        </div>
        <div class="org-host">
          <p class="top-detail-p">Organisation: ${data.org}</p>
          <p class="top-detail-p">Hostname: ${data.version}</p>
        </div>
      `;
    })
    .catch((error) => console.error("Error:", error));
}

function DisplayUserLocationOnGoogleMap(longi, latit) {
  let google_ifram = document.querySelector(".google_ifram");

  google_ifram.innerHTML = `
    <p class="heading2">Your Current Location</p>
    <iframe src="https://maps.google.com/maps?q=${latit},${longi}&z=15&output=embed" width="100%" height="470" frameborder="0" style="border:0"></iframe>`;
}

function postOfficeFound(pincode) {
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then(response => response.json())
    .then(data => {
      if (data && data[0] && data[0].PostOffice && Array.isArray(data[0].PostOffice)) {
        postOfficesData = data[0].PostOffice;
        displayPostOffices(postOfficesData);
      } else {
        throw new Error("Invalid data structure");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      document.querySelector(".card_container").innerHTML = "<p class='error'>Unable to retrieve post office information.</p>";
    });
}

function displayPostOffices(postOffices) {
  let card_container = document.querySelector(".card_container");
  card_container.innerHTML = "";

  postOffices.forEach(postOffice => {
    card_container.innerHTML += `
      <div class="card">
        <p class="top-detail-p">Name: ${postOffice.Name}</p>
        <p class="top-detail-p">Branch Type: ${postOffice.BranchType}</p>
        <p class="top-detail-p">Delivery Status: ${postOffice.DeliveryStatus}</p>
        <p class="top-detail-p">District: ${postOffice.District}</p>
        <p class="top-detail-p">State: ${postOffice.State}</p>
      </div>
    `;
  });
}

function findPostOffice() {
  let searchInput = document.getElementById('search-bar');
  let searchTerm = searchInput.value.toLowerCase();
  let filteredPostOffices = postOfficesData.filter(postOffice =>
    postOffice.Name.toLowerCase().includes(searchTerm) ||
    postOffice.BranchType.toLowerCase().includes(searchTerm)
  );
  displayPostOffices(filteredPostOffices);
}
