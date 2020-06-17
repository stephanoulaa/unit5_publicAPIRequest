// single ajax request to get and display 12 random users
const apiUrl = 'https://randomuser.me/api/?nat=us&results=12';
function getJSON(apiUrl, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl);
    xhr.onload = () => {
        if( xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);            
            getUserCardInfo(data.results.slice(0,12));
            return callback(data);
        }
    }
    xhr.send();
}

// create the modal window
const modalInfoContainer=document.createElement('div');
modalInfoContainer.classList.add('modal-info-container');

// define modal html
// needs both info container and employee as parameter, b/c uses both in final result
function getModalInfo(modalInfoContainer, employee) {
    
    // define sections of birthday separately
    var birthdayYear = employee.dob.date.slice(0,4);
    var birthdayMonth = employee.dob.date.slice(8,10);
    var birthdayDay = employee.dob.date.slice(5,7);
    
    // add to innerHTML of modal info container
    modalInfoContainer.innerHTML=
        '<img class="modal-img" src="'+employee.picture.medium+'" alt="profile picture"><h3 id="name" class="modal-name cap">' + employee.name.first + ' ' + employee.name.last + '</h3><p class="modal-text">' + employee.email + '</p><p class="modal-text-cap">' + employee.location.city + '</p><hr><p class="modal-text">' + employee.phone.slice(0,5) + ' ' + employee.phone.slice(6) + '</p><p class="modal-text">' + employee.location.street.number + ' ' + employee.location.street.name + ', ' + employee.location.city + ', ' + employee.location.state + ', ' + employee.location.postcode + '</p><p class="modal-text">Birthday: ' + birthdayDay + '/' + birthdayMonth + '/' + birthdayYear + '</p>';
         
}


// get card for each user profile
const galleryClass = document.getElementsByClassName('gallery');

// takes in employees user data, and maps it for each individual employee
function getUserCardInfo(employees) {
    
    // since the card will have same format for each employee, use the map function
    employees.map(employee => {
        
        const card = document.createElement('div');
        card.classList.add('card');
        const employeeImage= document.createElement('div');
        const employeeItems = document.createElement('div');
        employeeImage.setAttribute('class',"card-img-container");
        employeeItems.setAttribute('class',"card-info-container");

        galleryClass[0].appendChild(card);
        card.appendChild(employeeImage);
        card.appendChild(employeeItems);

        // inside class="card" (1): everything inside of card-img-container
        employeeImage.innerHTML= '<img class="card-img" src="' + employee.picture.thumbnail + '" alt="profile picture">';
        
        // inside class="card" (2): everything inside card-info-container
        employeeItems.innerHTML= '<h3 id="name" class="card-name cap">' + employee.name.first + ' ' + employee.name.last + '</h3>' +
        '<p class="card-text">' + employee.email + '</p>' + '<p class="card-text cap">' + employee.location.city + ', ' + employee.location.state + '</p>';
    })
};

// store employye info (results from api) in an array, that gets populated by users returned by json
let results = [];
getJSON(apiUrl, (returnedData) => {
    results = returnedData.results;
});

// when the user clicks on user card
gallery.addEventListener('click', e => {
    
    
    const el = e.target;
    
    // if element clicked on has class='card' and isn't empty...
    if (el.getAttribute('class') !== null) {
        if (el.getAttribute('class').includes('card')) {
    
        // after some research, thought  .closest method would be the best option
        // source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
        const cardDiv = event.target.closest('.card');
        const fullName = cardDiv.querySelector('#name');
        const firstName = fullName.textContent.split(' ')[0];
        const lastName = fullName.textContent.split(' ')[1];

        // this lets us find the user by going thru the results array, so that it shows up on the modal and so below code can run
        var employee = results.find(employee => employee.name.first === firstName && employee.name.last === lastName);

            
        // define html elements related to modal, and assign classes to them
        const modalContainer=document.createElement('div');
        modalContainer.classList.add('modal-container');
            
        const modal=document.createElement('div');
        modal.classList.add('modal');

        // define button and button attributes that will close modal window (according to html template)
        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close-btn');
        closeButton.setAttribute('type','button');
        closeButton.setAttribute('id', 'modal-close-btn');
        closeButton.innerHTML=`<strong>X</strong>`

        // append close button and modal divs to gallery container
        gallery.appendChild(modalContainer).appendChild(modal).appendChild(closeButton)
        modal.appendChild(modalInfoContainer);

        // run getModalInfo function to populate modal when clicked on
        getModalInfo(modalInfoContainer,employee);
        
        // add event listener to remove modalContainer when close btn is clicked
        closeButton.addEventListener('click', (e)=>{
            modalContainer.remove();
        });
            
            
        }  // end of inner if statement
    } // end of outer if statement
    
});