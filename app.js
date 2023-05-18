const { createClient } = require('@nhost/nhost-js');
const config = require('./nhost.json');

const nhost = createClient(config);

const db = nhost.auth().database();

const numberDisplay = document.getElementById('numberDisplay');
const incrementBtn = document.getElementById('incrementBtn');

let currentNumber = 0;

function displayNumber() {
  numberDisplay.textContent = `Current Number: ${currentNumber}`;
}

incrementBtn.addEventListener('click', async () => {
  currentNumber++;
  displayNumber();

  // Store the updated number in the database
  try {
    await db.from('numbers').update({ id: 1, value: currentNumber });
    console.log('Number updated in the database');
  } catch (error) {
    console.error('Failed to update number in the database', error);
  }
});

// Retrieve the initial number from the database
async function getNumberFromDatabase() {
  try {
    const response = await db.from('numbers').select().eq('id', 1).single();
    if (response) {
      currentNumber = response.value;
      displayNumber();
    }
  } catch (error) {
    console.error('Failed to retrieve number from the database', error);
  }
}

getNumberFromDatabase();
