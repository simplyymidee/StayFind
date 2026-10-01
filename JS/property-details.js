import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");


if (propertyId) {
    const propertyRef = doc(db, "properties", propertyId);

    getDoc(propertyRef)
        .then((propertyDoc) => {
            if (propertyDoc.exists()) {
                const property = propertyDoc.data();

                document.getElementById("detailsTitle").innerHTML = property.title;
                document.getElementById("detailsLocation").innerHTML = property.location;
                document.getElementById("detailsPrice").innerHTML = `₦${property.price.toLocaleString()}/year`;
                document.getElementById("detailsBedrooms").innerHTML = property.bedrooms;
                document.getElementById("detailsDescription").innerHTML = property.description;
                document.getElementById("landlordName").innerHTML = property.ownerName;

                document.getElementById("contactLandlord").href =
                `https://mail.google.com/mail/?view=cm&fs=1&to=${property.ownerEmail}&su=Interested in ${property.title}`;

                document.getElementById("contactLandlord").target = "_blank";
            }
        })
        .catch((error) => {
            alert(error.message);
        });
}