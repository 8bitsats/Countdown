const ordJS = new OrdJS('https://ordinals.com/api');
const targetBlock = 840000;
const blockTime = 10; // Average time in minutes per block

async function updateCountdown() {
  try {
    // Initialize the OrdJS library
    await ordJS.init();
    
    // Fetch the current block height
    const currentHeight = await ordJS.getBlockheight();
    
    // Calculate blocks left and estimated time
    const blocksLeft = targetBlock - currentHeight;
    const minutesLeft = blocksLeft * blockTime;
    const targetDate = new Date(new Date().getTime() + minutesLeft * 60000);
    
    // Update countdown every second
    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;
      
      if (distance < 0) {
        clearInterval(interval);
        countdownElement.innerHTML = "Block 840,000 has been mined!";
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to fetch current block height:', error);
  }
}

updateCountdown();
let lastKnownHeight = 0;
const updateIntervalMinutes = 10; // How often to check for a new block

async function fetchWithRetry(url, retries = 3, backoff = 2000) {
    while (retries > 0) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch attempt failed, retrying...', retries, error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2; // Double the backoff interval
        }
    }
    throw new Error('All fetch attempts failed.');
}

// Initial update
updateCountdown();

// Set interval for periodic block height updates
setInterval(fetchAndUpdateBlockHeight, updateIntervalMinutes * 60000);
