
var latitude = 0; // Initialize latitude variable
var longitude = 0; // Initialize longitude variable
var pincodeData = []; // Array to store the pincode data

// function initMap(latitude, longitude) {
//     var userLocation = { lat: latitude, lng: longitude };
//     var map = new google.maps.Map(document.getElementById("map"), {
//         center: userLocation,
//         zoom: 10
//     });
//     var marker = new google.maps.Marker({
//         position: userLocation,
//         map: map,
//         title: "User Location"
//     });
// }
function initMap(latitude, longitude) {
    var iframeUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    var mapContainer = document.getElementById("map");
    mapContainer.innerHTML = `<iframe src="${iframeUrl}" style="border:0; width: 1408px; height: 649px;"></iframe>`;
}



function getLatLngFromJson(json) {
    latitude = parseFloat(json.loc.split(",")[0]);
    longitude = parseFloat(json.loc.split(",")[1]);
    initMap(latitude, longitude); // Call the function to initialize the map with the user's location
    displayLocationDetails(json); // Call the displayLocationDetails function with the JSON response
    getTimeFromTimeZone(json.timezone); // Call the getTimeFromTimeZone function with the timezone from JSON response
    getPincodeDetails(json.postal); // Call the getPincodeDetails function with the pincode from JSON response
}

function displayLocationDetails(json) {
    var lat = json.loc.split(",")[0];
    var lon = json.loc.split(",")[1];
    var city = json.city;
    var organization = json.org;
    var region = json.region;
    var hostname = location.hostname;

    // Display the location details on the page
    document.querySelector(".lat").textContent = " "+ lat;
    document.querySelector(".city").textContent = " "+city;
    document.querySelector(".organisation").textContent = " "+organization;
    document.querySelector(".long").textContent = " "+lon;
    document.querySelector(".region").textContent = " "+region;
    document.querySelector(".hostman").textContent = " "+hostname;
}

function getTimeFromTimeZone(timezone) {
    var currentDate = new Date().toLocaleDateString("en-US", { timeZone: timezone });
    var currentTime = new Date().toLocaleTimeString("en-US", { timeZone: timezone });
    document.querySelector(".time-zone").textContent = timezone ; // Update the HTML element with the timezone
    document.querySelector(".date-time").textContent = currentDate + " " + currentTime; // Update the HTML element with the date and time
}

function getPincodeDetails(pincode) {
    var apiUrl = "https://api.postalpincode.in/pincode/" + pincode;
    $.get(apiUrl, function (response) {
        var result = response[0];
        var message = result.Message;
        var noOfPincodes = result.PostOffice.length;
        document.querySelector(".pincode").textContent = pincode; // Update the HTML element with the pincode
        document.querySelector(".noOf-pin").textContent = "Number of pincode(s) found: " + noOfPincodes; // Update the HTML element with the number of pincodes found
        pincodeData = result.PostOffice; // Store the pincode data in the pincodeData array
        displayFilteredPostOffices(); // Display the filtered post office details
    });
}

function displayFilteredPostOffices() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var filteredPostOffices = pincodeData.filter(function (postOffice) {
        return (
            postOffice.Name.toLowerCase().includes(searchInput) ||
            postOffice.BranchType.toLowerCase().includes(searchInput) ||
            postOffice.DeliveryStatus.toLowerCase().includes(searchInput) ||
            postOffice.District.toLowerCase().includes(searchInput) ||
            postOffice.Division.toLowerCase().includes(searchInput)
        );
    });
    var filterContainer = document.querySelector(".filter-postDetails");
    filterContainer.innerHTML = ""; // Clear the existing filtered post office details
    
   
    // Iterate through the filtered post offices and display the details
    filteredPostOffices.forEach(function (postOffice) {
        var gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");
        var name = postOffice.Name;
        var branchType = postOffice.BranchType;
        var deliveryStatus = postOffice.DeliveryStatus;
        var district = postOffice.District;
        var division = postOffice.Division;

        // Create the HTML elements for each detail and append to the filter container
        var nameElement = document.createElement("div");
        nameElement.classList.add("details");
        nameElement.textContent ="Name: " + name;
        gridContainer.appendChild(nameElement);
        

        var branchTypeElement = document.createElement("div");
        branchTypeElement.classList.add("details");
        branchTypeElement.textContent = "Branch Type: "+ branchType;
        gridContainer.appendChild(branchTypeElement);

        var deliveryStatusElement = document.createElement("div");
        deliveryStatusElement.classList.add("details");
        deliveryStatusElement.textContent = "Delivery Status: "+ deliveryStatus;
        gridContainer.appendChild(deliveryStatusElement);

        var districtElement = document.createElement("div");
        districtElement.classList.add("details");
        districtElement.textContent = "District: "+district;
        gridContainer.appendChild(districtElement);

        var divisionElement = document.createElement("div");
        divisionElement.classList.add("details");
        divisionElement.textContent = "Division: "+division;
        gridContainer.appendChild(divisionElement);

        filterContainer.appendChild(gridContainer);
    });
    
}

// document.getElementById("getIPButton").addEventListener("click", function () {
//     $.getJSON("https://ipinfo.io/?token=6b6600af6bde0f", function (json) {
//         console.log(json);
//         console.log(Object.keys(json));
        
//         document.getElementById('entire-content').style.display = 'block';

//         // Remove the button element
//         var button = document.getElementById('getIPButton');
//         button.parentNode.removeChild(button);

//         // Show the hidden elements
//         document.getElementById('container').style.display = 'block';
//         document.querySelector('.details-container').style.display = 'block';
//         document.getElementById('searchInput').style.display = 'block';
//         document.querySelector('.filter-postDetails').style.display = 'block';

//         getLatLngFromJson(json);
        
//     });
// });
document.getElementById("getIPButton").addEventListener("click", function () {
    $.getJSON("https://ipinfo.io/?token=6b6600af6bde0f", function (json) {
        console.log(json);
        console.log(Object.keys(json));
        
        document.getElementById('entire-content').style.display = 'block';
        document.getElementById('getIPButton').style.display = 'none';
        // Remove the button element
        // var button = document.getElementById('getIPButton');
        // if (button) {
        //     button.parentNode.removeChild(button);
        // } else {
        //     console.error("Button element not found.");
        // }

        // // Show the hidden elements
        // document.getElementById('container').style.display = 'block';
        // document.querySelector('.details-container').style.display = 'block';
        // document.getElementById('searchInput').style.display = 'block';
        // document.querySelector('.filter-postDetails').style.display = 'block';

        getLatLngFromJson(json);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error retrieving JSON data:", textStatus, errorThrown);
    });
});


document.getElementById("searchInput").addEventListener("input", function () {
    displayFilteredPostOffices();
});