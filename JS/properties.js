import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const propertyForm = document.getElementById("propertyForm");

const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

if (propertyId && propertyForm) {
    document.getElementById("formTitle").innerHTML = "Edit Property";
    document.getElementById("formSubtitle").innerHTML = "Update the details of your student accommodation.";
    document.getElementById("submitBtn").innerHTML = "Update Property";


    const propertyRef = doc(db, "properties", propertyId);

    getDoc(propertyRef).then((propertyDoc) => {
        if (propertyDoc.exists()) {
            const property = propertyDoc.data();

            document.getElementById("propertyTitle").value = property.title;
            document.getElementById("propertyLocation").value = property.location;
            document.getElementById("propertyPrice").value = property.price;
            document.getElementById("propertyBedrooms").value = property.bedrooms;
            document.getElementById("propertyDescription").value = property.description;
        }
    });
}

if (propertyForm) {
    propertyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("propertyTitle").value;
        const location = document.getElementById("propertyLocation").value;
        const price = document.getElementById("propertyPrice").value;
        const bedrooms = document.getElementById("propertyBedrooms").value;
        const description = document.getElementById("propertyDescription").value;

        const user = auth.currentUser;

        if (user) {
            const propertyData = {
                title: title,
                location: location,
                price: Number(price),
                bedrooms: Number(bedrooms),
                description: description,
                ownerId: user.uid,
                ownerName: user.displayName,
                ownerEmail: user.email
            };

            if (propertyId) {
                updateDoc(doc(db, "properties", propertyId), propertyData)
                    .then(() => {
                        alert("Property updated successfully!");
                        window.location.href = "dashboard.html";
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            } else {
                addDoc(collection(db, "properties"), propertyData)
                    .then(() => {
                        alert("Property added successfully!");
                        window.location.href = "dashboard.html";
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        }
    });
}

const userProperties = document.getElementById("userProperties");

if (userProperties) {
    onAuthStateChanged(auth, function (user) {
        if (user) {
            const propertyQuery = query(
                collection(db, "properties"),
                where("ownerId", "==", user.uid)
            );

            getDocs(propertyQuery).then((querySnapshot) => {
                userProperties.innerHTML = "";

                if (querySnapshot.empty) {
                    userProperties.innerHTML = `
                        <div class="empty-properties">
                            <i class="fa-solid fa-house-circle-xmark"></i>
                            <h3>No properties yet</h3>
                            <p>You haven't added any properties yet.</p>
                            <a href="add-property.html">Add Your First Property</a>
                        </div>
                    `;
                }

                querySnapshot.forEach((propertyDoc) => {
                    const property = propertyDoc.data();


                    userProperties.innerHTML += `
                        <div class="dashboard-property-card">

                            <div class="dashboard-property-info">
                                <h3>${property.title}</h3>
                                <p>${property.location}</p>

                                <div class="property-details">
                                    <span>${property.bedrooms} Room(s)</span>
                                    <span>₦${property.price.toLocaleString()}/year</span>
                                </div>

                                <div class="property-actions">
                                    <a href="property-details.html?id=${propertyDoc.id}" class="view-btn">View Details</a>
                                    <button class="edit-btn" onclick="editProperty('${propertyDoc.id}')">Edit</button>
                                    <button class="delete-btn" onclick="deleteProperty('${propertyDoc.id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            });
        }
    });
}

//DELETE PROPERTY FUNCTION
window.deleteProperty = function (id) {
    const answer = confirm("Are you sure you want to delete this property?");

    if (answer) {
        deleteDoc(doc(db, "properties", id))
            .then(() => {
                alert("Property deleted successfully!");
                location.reload();
            })
            .catch((error) => {
                alert(error.message);
            });
    }
};

//EDIT PROPERTY FUNCTION
window.editProperty = function (id) {
    window.location.href = `add-property.html?id=${id}`;
};



let propertiesArray = [];
const allProperties = document.getElementById("allProperties");

if (allProperties) {
    getDocs(collection(db, "properties"))
        .then((querySnapshot) => {
            allProperties.innerHTML = "";


            const propertyImages = [
                "../IMAGES/house1.jpg",
                "../IMAGES/house2.jpg",
                "../IMAGES/house3.jpg"
            ];

            let imageIndex = 0;



            querySnapshot.forEach((propertyDoc) => {
                const property = propertyDoc.data();
                property.id = propertyDoc.id;
                propertiesArray.push(property);

                allProperties.innerHTML += `
    <div class="property-card">

        <img src="${propertyImages[imageIndex]}" alt="Student accommodation">

        <div class="property-card-content">

            <h3>${property.title}</h3>

            <p class="property-location">
                <i class="fa-solid fa-location-dot"></i>
                ${property.location}
            </p>

            <div class="property-card-details">
                <span>
                    <i class="fa-solid fa-bed"></i>
                    ${property.bedrooms} Room(s)
                </span>

                <span class="property-price">
                    ₦${property.price.toLocaleString()}/year
                </span>
            </div>

            <a href="property-details.html?id=${propertyDoc.id}" class="view-details-btn">
                View Details
            </a>

        </div>
    </div>
`;
                imageIndex++;

                if (imageIndex === propertyImages.length) {
                    imageIndex = 0;
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
}



//SEARCH FUNCTIONALITY

// SEARCH FUNCTIONALITY

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.addEventListener("click", function () {

        const location = document.getElementById("searchLocation").value.toLowerCase();
        const maxPrice = document.getElementById("searchPrice").value;
        const bedrooms = document.getElementById("searchBedrooms").value;

        const filteredProperties = propertiesArray.filter(function (property) {

            const matchesLocation =
                property.location.toLowerCase().includes(location);

            const matchesPrice =
                maxPrice === "" || property.price <= Number(maxPrice);

            let matchesBedrooms;

            if (bedrooms === "4") {
                matchesBedrooms = property.bedrooms >= 4;
            } else {
                matchesBedrooms =
                    bedrooms === "" || property.bedrooms === Number(bedrooms);
            }
            return matchesLocation && matchesPrice && matchesBedrooms;
        });

        displayProperties(filteredProperties);
    });
}


function displayProperties(properties) {

    allProperties.innerHTML = "";

    const propertyImages = [
        "../IMAGES/house1.jpg",
        "../IMAGES/house2.jpg",
        "../IMAGES/house3.jpg"
    ];

    let imageIndex = 0;

    if (properties.length === 0) {
        allProperties.innerHTML = `
            <p>No properties found.</p>
        `;
        return;
    }

    properties.forEach(function (property) {

        allProperties.innerHTML += `
            <div class="property-card">

                <img src="${propertyImages[imageIndex]}" alt="Student accommodation">

                <div class="property-card-content">

                    <h3>${property.title}</h3>

                    <p class="property-location">
                        <i class="fa-solid fa-location-dot"></i>
                        ${property.location}
                    </p>

                    <div class="property-card-details">
                        <span>
                            <i class="fa-solid fa-bed"></i>
                            ${property.bedrooms} Room(s)
                        </span>

                        <span class="property-price">
                            ₦${property.price.toLocaleString()}/year
                        </span>
                    </div>

                    <a href="property-details.html?id=${property.id}" class="view-details-btn">
                        View Details
                    </a>

                </div>
            </div>
        `;

        imageIndex++;

        if (imageIndex === propertyImages.length) {
            imageIndex = 0;
        }
    });
}