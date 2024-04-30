const express = require('express')
const {Computer} = require('./computer.js')

const mac_address = process.env.MAC_ADDRESS
if (!mac_address) {
    console.error('Missing required env variable MAC_ADDRESS')
    process.exit(10)
}
const computer = new Computer(mac_address)

const app = express()

app.use(express.static('public'))

app.post('/wake', (req, res) => {})

const port = process.env.PORT ?? 8080
app.listen(port)
console.log(`Listening on port ${port}`)
