// selection
const form = document.querySelector('.form');
const formCloseBtn = document.querySelector('.form__close');
const formEdit = document.querySelector('.form--edit');

const alertEl = document.querySelector('.alert');
const alertErrorEl = document.querySelector('.alert--error');

const sortBtn = document.querySelector('.workouts__sort');
const inputType = document.querySelector('.form__input--type');

const workoutsContainer = document.querySelector('.workouts');

const inputCadence = document.querySelector('.form__input--cadence');
const inputElevGain = document.querySelector('.form__input--elevGain');
const inputDuration = document.querySelector('.form__input--duration');
const inputDistance = document.querySelector('.form__input--distance');

const workoutCloseBtn = document.querySelector('.workout__close');
const deleteAllBtn = document.querySelector('.workouts__close');
const workoutEditBtn = document.querySelector('.workout__edit');

const overlay = document.querySelector('.overlay');

const filterBtn = document.querySelector('.filter');
// architecture
let counter = 1;
class App {
  #workouts = [];
  #markers = [];
  #map;
  #mapEvent;
  #workoutEvent;
  #sorting = true;

  constructor() {
    this._getCurrUserPostion();

    // get date from local storage
    this._getLocalStorage();

    // handlers
    this._handlingFormSubmit();
    this._handlingClickOnCloseFromBtn();

    this._handlingToggelType();

    this._hundlingClickOnTheNewWorkout();
    this._handlingClickOnDeleteAllBtn();

    this._handlingClickOnsortBtn();

    this._handlingToggelOnsortBtn();

    this._handlingClickOnAlertAnswer();

    this._handlingClickOnAlertCloseBtn();
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _getCurrUserPostion() {
    navigator.geolocation.getCurrentPosition(
      this._getPosition.bind(this),
      function () {
        alert('cloud not display the map, make sure to turn your location on');
      }
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _getPosition(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this._setMap(coords);

    //_hundling Click On Map
    this._hundlingClickOnMap();
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _setMap(coords) {
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // add marker for local storage workouts
    this.#workouts.forEach(workout => this._addMarker(workout));
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _addMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();

    this.#markers.push(marker);
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _hundlingClickOnMap() {
    this.#map.on('click', this._showForm.bind(this));
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _showForm(mapEv) {
    this.#mapEvent = mapEv;
    form.classList.remove('form--hidden');
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _handlingFormSubmit() {
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _handlingToggelType() {
    inputType.addEventListener('change', this._changeType);
  }

  /////////////////////////////////////////////////////////////////////////////////////

  _changeType() {
    inputElevGain.closest('.form__row').classList.toggle('form_row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form_row--hidden');
  }

  /////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevGain.value =
        '';

    form.classList.add('form--hidden');
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _hundlingClickOnTheNewWorkout() {
    workoutsContainer.addEventListener(
      'click',
      this._moveToCorrespondingMarker.bind(this)
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _handlingClickOnDeleteAllBtn() {
    deleteAllBtn.addEventListener('click', this._halperFunc.bind(this));
  }

  _halperFunc(e) {
    this._showAlert(e.target);
  }

  /////////////////////////////////////////////////////////////////////////////////////

  _handlingClickOnCloseFromBtn() {
    formCloseBtn.addEventListener('click', this._hideEditForm.bind(this));
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _handlingClickOnsortBtn() {
    sortBtn.addEventListener('click', this._sortWorkout.bind(this));
  }

  // /////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////

  _handlingToggelOnsortBtn() {
    document.querySelectorAll('.select').forEach(s => {
      s.addEventListener('change', this._onChange.bind(this));
    });
  }

  _onChange() {
    this.#sorting = true;
  }

  // /////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////

  _reserFilterState() {
    document.querySelector('.select--type').value = 'distance';
    document.querySelector('.select--direction').value = 'ascending';
    filterBtn.textContent = 'Filter';
  }
  // /////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////

  _sortWorkout(e) {
    //make Sort Btn Visible;
    if (e.target.classList.contains('btn')) {
      document.querySelectorAll('.select').forEach(s => {
        s.classList.toggle('feature--hidden');
      });
    }

    //////////////////////////

    // get data
    const inputSelectType = document.querySelector('.select--type').value;
    const inputSelectDirection =
      document.querySelector('.select--direction').value;

    // console.log(inputSelectDirection);
    if (e.target.classList.contains('filter')) {
      this.#sorting
        ? (filterBtn.textContent = 'Filtered')
        : (filterBtn.textContent = 'Filter');

      // filterBtn.textContent =
      //   filterBtn.textContent === 'Filter' ? Filtered : 'Filter';

      workoutsContainer.innerHTML = '';

      const workouts = this.#sorting
        ? this.#workouts.slice().sort((a, b) => {
            return inputSelectDirection === 'descending'
              ? b[
                  `${
                    inputSelectType[0].toLowerCase() + inputSelectType.slice(1)
                  }`
                ] -
                  a[
                    `${
                      inputSelectType[0].toLowerCase() +
                      inputSelectType.slice(1)
                    }`
                  ]
              : a[
                  `${
                    inputSelectType[0].toLowerCase() + inputSelectType.slice(1)
                  }`
                ] -
                  b[
                    `${
                      inputSelectType[0].toLowerCase() +
                      inputSelectType.slice(1)
                    }`
                  ];
          })
        : this.#workouts;

      this.#sorting = this.#sorting === true ? false : true;

      workouts.forEach(w => this._displayWorkout(w));
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _removeAllWorkouts() {
    let index = 0;
    this.#workouts.forEach(work => {
      const workoutElement = document.querySelector(`[data-id="${work.id}"]`);

      workoutElement.classList.add('remove');

      setTimeout(() => workoutElement.remove(), 1000);

      // remove markers
      this.#map.removeLayer(this.#markers[index]);
      index++;
    });

    // clear ARRAY markers
    this.#markers.splice(0);

    // clear ARRAY WORKOUTS
    this.#workouts.splice(0);

    // hide deleteAll btn
    this._hideDeleteAllBtn();
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _handlingClickOnAlertAnswer() {
    document
      .querySelector('.alert__answer')
      .addEventListener('click', this._checkAlertAnswer.bind(this));
  }

  /////////////////////////////////////////////////////////////////////////////////////
  _handlingClickOnAlertCloseBtn() {
    document
      .querySelector('.alert__close')
      .addEventListener('click', this._hideAlertError);
  }

  /////////////////////////////////////////////////////////////////////////////////////

  _checkAlertAnswer(e) {
    if (e.target.classList.contains('alert__answer--agree')) {
      if (e.target.closest('.alert').classList.contains('alert--deleteAll')) {
        this._removeAllWorkouts();
        this._deleteAllAtemsFromLocalStorage();
      } else {
        const workoutElement = this.#workoutEvent.target.closest('.workout');

        this._removeWorkout(workoutElement);
        this._deleteAtemFromLocalStorage(workoutElement);
      }

      /////////////
      this._hideAlert();
    }
    if (e.target.classList.contains('alert__answer--discard')) {
      this._hideAlert();
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _moveToCorrespondingMarker(e) {
    this.#workoutEvent = e;
    const workoutElement = e.target.closest('.workout');

    if (!workoutElement) return;

    // find Corresponding in the workout arry
    const workout = this.#workouts.find(
      w => w.id === workoutElement.dataset.id
    );

    /////////////////////////////////////////////////////
    if (e.target.classList.contains('workout__close')) {
      this._showAlert(e.target);
      return;
    }
    if (e.target.classList.contains('workout__edit')) {
      this._editWorkout(workout);
      return;
    }
    /////////////////////////////////////////////////////

    const options = {
      animate: true,
      pan: {
        duration: 1,
      },
    };
    this.#map.setView(workout.coords, 13, options);
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _showAlert(target) {
    ///////////////////
    if (target.classList.contains('workouts__close')) {
      document.querySelector('.alert').classList.add('alert--deleteAll');
      // change the alert message
      document
        .querySelector('.alert')
        .querySelector('.alert__message').innerHTML =
        'Are you sure you whant to delete all workouts ?';
    }
    ///////////////////

    document.querySelector('.alert').classList.remove('hidden');
    overlay.classList.remove('hidden');
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _hideAlert() {
    /////
    document.querySelector('.alert').classList.remove('alert--deleteAll');
    // change the alert message
    document
      .querySelector('.alert')
      .querySelector('.alert__message').innerHTML =
      'Are you sure you whant to delete this workout ?';

    document.querySelector('.alert').classList.add('hidden');
    overlay.classList.add('hidden');
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _showAlertError() {
    ///////////////////
    alertErrorEl.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  _hideAlertError() {
    /////
    alertErrorEl.classList.add('hidden');
    overlay.classList.add('hidden');
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _removeWorkout(workoutElement) {
    const height =
      Number.parseFloat(getComputedStyle(workoutElement).height) +
      Number.parseFloat(getComputedStyle(workoutElement).padding) * 2 +
      Number.parseFloat(getComputedStyle(workoutElement).marginBottom);

    workoutElement.classList.add('remove');

    setTimeout(() => {
      workoutElement.style.marginTop = `${-height}px`;
    }, 500);

    // setTimeout(() => target.classList.add('fideUp'), 800);

    setTimeout(() => workoutElement.remove(), 1000);

    const index = this.#workouts.findIndex(
      work => work.id === workoutElement.dataset.id
    );

    // remove marker
    this.#map.removeLayer(this.#markers[index]);

    // REMOVE FROM ARRAY markers
    this.#markers.splice(index, 1);

    // REMOVE FROM ARRAY WORKOUTS
    this._removeFromWorkoutArr(index);
  }
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _showEditForm() {
    form.classList.add('form--edit');
    this._hideForm();
    overlay.classList.remove('hidden');

    ///////////
    document.querySelector('.aside').style.zIndex = 'auto';
    document.querySelector('.main').style.zIndex = '-1';
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _hideEditForm() {
    form.classList.remove('form--edit');
    form.classList.remove('form--edit-cycling');
    form.classList.remove('form--edit-running');

    this._hideForm();
    overlay.classList.add('hidden');

    ///////////
    document.querySelector('.aside').style.zIndex = '999';
    document.querySelector('.main').style.zIndex = '1';
  }

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  _editWorkout(workout) {
    this._showEditForm();

    // get data from the workout

    const type = workout.type;
    const distance = workout.distance;
    const duration = workout.duration;

    // display the data into the edit form
    inputDistance.value = distance;
    inputDuration.value = duration;
    inputType.value = `${type}`;

    if (type === 'running') {
      form.classList.add('form--edit-running');

      inputElevGain.closest('.form__row').classList.add('form_row--hidden');
      inputCadence.closest('.form__row').classList.remove('form_row--hidden');

      // get data from the workout
      const cadence = workout.cadence;

      // display the data into the edit form
      inputCadence.value = cadence;
    }

    if (type === 'cycling') {
      form.classList.add('form--edit-cycling');

      inputElevGain.closest('.form__row').classList.remove('form_row--hidden');
      inputCadence.closest('.form__row').classList.add('form_row--hidden');

      // get data from the workout
      const elevGain = workout.elevGain;

      // display the data into the edit form
      inputElevGain.value = elevGain;
    }

    setTimeout(() => {
      this._showForm();
    }, 300);
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _newWorkout(e) {
    //  submit event
    e.preventDefault();

    // halper functions
    const isItpositive = (...inputs) => inputs.every(inp => inp > 0);
    const isItNumber = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    //get the input fields values
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // let coords;
    let newWorkout;

    const coords = [this.#mapEvent?.latlng.lat, this.#mapEvent?.latlng.lng];

    /////////////////////////////////

    const workoutEl = this.#workoutEvent?.target.closest('.workout');

    let workoutIndex = this.#workouts.findIndex(
      w => w.id === workoutEl?.dataset.id
    );

    /////////////////////////////

    //validations;
    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !isItNumber(distance, duration, cadence) ||
        !isItpositive(distance, duration, cadence)
      ) {
        this._showAlertError();
        return;
      }

      const checkCoords = () =>
        coords[0] ? coords : this.#workouts[workoutIndex].coords;

      // create a runnning object
      newWorkout = new Running(checkCoords(), distance, duration, cadence);

      // edit object
      if (e.target.classList.contains('form--edit')) {
        /////////////////
        // apply change to the Dom
        workoutEl.querySelector('.workout__cadence').textContent = `${cadence}`;

        workoutEl.querySelector(
          '.workout__pace'
        ).textContent = `${newWorkout.pace}`;
      }
    }

    if (type === 'cycling') {
      const elevGain = +inputElevGain.value;
      if (
        !isItNumber(distance, duration, elevGain) ||
        !isItpositive(distance, duration)
      ) {
        this._showAlertError();
        return;
      }

      // create a cycling object
      newWorkout = new Cycling(coords, distance, duration, elevGain);

      // edit object
      if (e.target.classList.contains('form--edit')) {
        // apply change to the Dom

        workoutEl.querySelector(
          '.workout__elevGain'
        ).textContent = `${elevGain}`;

        workoutEl.querySelector(
          '.workout__speed'
        ).textContent = `${newWorkout.speed}`;
      }
    }

    if (e.target.classList.contains('form--edit')) {
      //weather running or cycling
      const id = this.#workouts[workoutIndex].id;
      this.#workouts[workoutIndex] = newWorkout;
      this.#workouts[workoutIndex].id = id;

      // apply change to the Dom
      workoutEl.querySelector('.workout__distance').textContent = `${distance}`;
      workoutEl.querySelector('.workout__duration').textContent = `${duration}`;

      this._hideEditForm();

      return;
    }

    // add to workout arry
    this._addToWorkoutArr(newWorkout);

    // add marker

    this._addMarker(newWorkout);

    this._displayWorkout(newWorkout);

    this._hideForm();

    // set local storage
    this._setLocalStorage();
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _addToWorkoutArr(workout) {
    this.#workouts.push(workout);
    this._showDeleteAllBtn();
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _removeFromWorkoutArr(workoutIndex) {
    this.#workouts.splice(workoutIndex, 1);

    this._hideDeleteAllBtn();
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _showDeleteAllBtn() {
    if (this.#workouts.length > 1) {
      const itExist = type =>
        this.#workouts.some(workout => workout.type === `${type}`);
      if (itExist('running') && itExist('cycling')) {
        deleteAllBtn.classList.add('workouts__close--running');
        deleteAllBtn.classList.add('workouts__close--cycling');
      }

      if (itExist('running'))
        deleteAllBtn.classList.add('workouts__close--running');

      if (itExist('cycling'))
        deleteAllBtn.classList.add('workouts__close--cycling');

      document.querySelector('.workouts__feature').classList.add('visible');
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _hideDeleteAllBtn() {
    const itExist = type =>
      this.#workouts.some(workout => workout.type === `${type}`);

    if (!itExist('running') && !itExist('cycling')) {
      deleteAllBtn.classList.remove('workouts__close--cycling');
      deleteAllBtn.classList.remove('workouts__close--running');
    }

    if (!itExist('running'))
      deleteAllBtn.classList.remove('workouts__close--running');

    if (!itExist('cycling'))
      deleteAllBtn.classList.remove('workouts__close--cycling');

    if (this.#workouts.length <= 1) {
      document.querySelector('.workouts__feature').classList.remove('visible');
      this._reserFilterState();
      document.querySelectorAll('.select').forEach(s => {
        s.classList.add('feature--hidden');
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _displayWorkout(workout) {
    let html = `
            <li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
                <span class="workout__close"></span>
                <span class="workout__edit">Edit</span>
               <h2 class="workout__heading">${workout.description.slice(
                 4
               )} </h2>
               <div class="workout__informations">
                 <div class="workout__info">
                   <span class="">${
                     workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                   }</span>
                   <span class="workout__distance">${workout.distance}</span>
                   <span class="workout__unit">KM</span>
                 </div>
                 <div class="workout__info">
                   <span class="">⏱</span>
                   <span class="workout__duration">${workout.duration}</span>
                   <span class="workout__unit">min</span>
                 </div>
     `;
    if (workout.type === 'running') {
      html += `
                 <div class="workout__info">
                   <span class="">⚡️</span>
                   <span class="workout__pace">${workout.pace}</span>
                   <span class="workout__unit">KM / H</span>
                 </div>
                <div class="workout__info">
                   <span class="">🦶🏼</span>
                   <span class="workout__cadence">${workout.distance}</span>
                   <span class="workout__unit">M</span>
                 </div>
               </div>
             </li>`;
    }
    if (workout.type === 'cycling') {
      html += `
                <div class="workout__info">
                   <span class="">⚡️</span>
                   <span class="workout__speed">${workout.speed}</span>
                   <span class="workout__unit">KM / H</span>
                 </div>
                <div class="workout__info">
                   <span class="">⛰</span>
                   <span class="workout__elevGain">${workout.elevGain}</span>
                   <span class="workout__unit">M</span>
                 </div>
               </div>
             </li>`;
    }
    workoutsContainer.insertAdjacentHTML('afterbegin', html);
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(workout => this._displayWorkout(workout));
  }

  _deleteAtemFromLocalStorage(workoutElement) {
    const data = JSON.parse(localStorage.getItem('workouts'));

    this._deleteAllAtemsFromLocalStorage();

    let workouts = [];

    data.forEach(workout => {
      if (workout.id !== workoutElement.dataset.id) {
        workouts.push(workout);
      }
    });

    localStorage.setItem('workouts', JSON.stringify(workouts));
  }
  _deleteAllAtemsFromLocalStorage() {
    localStorage.removeItem('workouts');
  }
}

const app1 = new App();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

class workout {
  id = Date.now() + '';
  date = new Date();

  constructor(coords, distance, duration) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
  getDistance() {
    return this.distance;
  }
  getDuration() {
    return this.duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${
      this.type
    } on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////

class Running extends workout {
  type = 'running';
  pace;
  cadence;
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = +(this.getDuration() / this.getDistance()).toFixed(1);
    return this.pace;
  }
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
class Cycling extends workout {
  type = 'cycling';
  speed;
  elevGain;

  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = +(this.getDistance() / (this.getDuration() / 60)).toFixed(1);
    return this.speed;
  }
}
