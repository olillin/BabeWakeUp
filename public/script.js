/**
 * Attempt to wake up
 */
function wake() {
    fetch('/wake', {
        method: 'POST',
    }).then(res => {})
}

/**
 * Change the website state
 * @param {string} state Must be one of the following: SLEEPING, WAKING, FAILED, AWAKE
 */
function setState(state) {
    const stateImage = document.getElementById('stateImage')
    if (!stateImage) return

    switch (state) {
        case 'SLEEPING':
            stateImage.src = '/img/sleeping.png'
            stateImage.alt = 'Sleeping'
            break
        case 'WAKING':
            stateImage.src = '/img/waking.gif'
            stateImage.alt = 'Waking up...'
            break
        case 'FAILED':
            stateImage.src = '/img/failed.png'
            stateImage.alt = 'Failed to wake up'
            break
        case 'AWAKE':
            stateImage.src = '/img/awake.png'
            stateImage.alt = 'Awake'
            break
    }
}
