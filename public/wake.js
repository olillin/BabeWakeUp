/** @type {string} */
var currentState

/**
 * Attempt to wake up
 */
function wake() {
    console.log('Attempting to wake up computer...')
    fetch('/wake', {
        method: 'POST',
    }).then(async res => {
        const json = await res.json()
        if (res.status === 200) {
            if (json.success) setState('AWAKE')
            else setState('FAILED')
        } else {
            console.error(`Error occurred while waking up computer: ${json.message}`)
            setState('FAILED')
        }
    })
}

/**
 * Change the website state
 * @param {string} state Must be one of the following: SLEEPING, WAKING, FAILED, AWAKE
 * @returns {string} The current state after running
 */
function setState(state) {
    state = state.toUpperCase()

    /** @type {HTMLImageElement | null} */
    const stateImage = document.getElementById('stateImage')
    if (!stateImage) return currentState

    /** @type {HTMLButtonElement | null} */
    const wakeButton = document.getElementById('wake')
    if (!wakeButton) return currentState

    switch (state) {
        case 'SLEEPING':
            stateImage.src = '/img/sleeping.png'
            stateImage.alt = 'Sleeping'
            wakeButton.disabled = false
            break
        case 'WAKING':
            stateImage.src = '/img/waking.gif'
            stateImage.alt = 'Waking up...'
            wakeButton.disabled = true
            break
        case 'FAILED':
            stateImage.src = '/img/failed.png'
            stateImage.alt = 'Failed to wake up'
            wakeButton.disabled = false
            break
        case 'AWAKE':
            stateImage.src = '/img/awake.png'
            stateImage.alt = 'Awake'
            wakeButton.disabled = true
            break
        default:
            console.warn(`Attempted to switch to unknown state: ${state}`)
            return currentState
    }
    currentState = state
    return currentState
}
