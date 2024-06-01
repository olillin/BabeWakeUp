const express = require('express')
const { Computer, MAC } = require('./computer.js')

if (process.env.MAC_ADDRESS == null) {
    console.error('Required environment variable MAC_ADDRESS is missing')
    process.exit(10)
}
if (process.env.IP_ADDRESS == null) {
    console.error('Required environment variable IP_ADDRESS is missing')
    process.exit(10)
}
const mac_address = new MAC(process.env.MAC_ADDRESS)
const ip_address = process.env.IP_ADDRESS
const computer = new Computer(mac_address, ip_address)
console.log(`Configured MAC address is ${mac_address.separated(':')}`)
console.log(`Configured IP address is ${ip_address}`)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.post('/wake', (req, res) => {
    console.log(`Recieved request to wake up computer from ${req.ip}`)
    // Authorize request
    // TODO

    // Wake up
    computer
        .wake()
        .then(response => {
            if (response === true) {
                console.log('Turned on computer successfully')
            } else {
                console.warn('Failed to turn on computer')
            }
            res.status(200).json({
                success: response,
            })
        })
        .catch(err => {
            console.error(`Encountered error while waking up computer: ${err}`)
            res.status(500).json({
                message: 'Error occured while waking up computer',
            })
        })
})

app.get('/awake', (req, res) => {
    console.log(`Recieved question if computer is awake from ${req.ip}`)
    computer
        .isAwake()
        .then(isAwake => {
            console.log(`Responded with ${isAwake}`)
            res.status(200).end(isAwake.toString())
        })
        .catch(err => {
            res.status(500).end(`Unable to check computer:\n${err}`)
        })
})

const port = process.env.PORT ?? 8080
app.listen(port)
console.log(`Listening on port ${port}`)
