import bot from '../images/bot.png';
import user from '../images/user.png';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
};

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div dir="auto" class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

const HeroSection = document.querySelector('.hero')

const handleSubmit = async (e) => {
  e.preventDefault();

  // remove Hero Section
  HeroSection.remove()

  const data = new FormData(form)

  // user's chat
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset()

  // bot's chat
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

const buttons = document.querySelectorAll("#button_data");
const areaField = document.getElementById("form_fill");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    areaField.value = button.dataset.area;
  });
});