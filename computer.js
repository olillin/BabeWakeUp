const child_process = require('child_process')
const wol = require('wol')
const ping = require('ping')

class Computer {
    /** @type {MAC} */
    mac_address
    /** @type {string} */
    ip_address

    /**
     * @param {MAC} mac_address The MAC address of this computer
     * @param {string} ip_address The IP address of this computer
     */
    constructor(mac_address, ip_address) {
        try {
            wol.createMagicPacket(mac_address.separated(':'))
        } catch (e) {
            throw new Error('Malformed MAC address')
        }
        this.mac_address = mac_address
        this.ip_address = ip_address
    }

    /**
     * Wake up the computer.
     * @return {Promise<Boolean>} if waking up computer was successful
     */
    wake = function () {
        console.log(`Attempting to wake up ${this}`)
        return new Promise((resolve, reject) => {
            // Send Wake on LAN package
            let options = {
                address: this.ipAddress,
            }
            wol.wake(this.mac_address.separated(':'), options, (err, res) => {
                // End Promise
                if (err) {
                    reject(err)
                } else {
                    this.isAwake()
                        .then(awake => {
                            resolve(awake)
                        })
                        .catch(err => {
                            reject(err)
                        })
                }
            })
        })
    }

    /**
     * Check if the computer is awake.
     * @return {Promise<boolean>}
     */
    isAwake = function () {
        return new Promise(async (resolve, reject) => {
            ping.promise.probe(this.ip_address).then(response => {
                resolve(response.alive)
            })
        })
    }

    toString = function () {
        return `Computer(${this.mac_address.separated(':')})`
    }
}

class MAC {
    /** @type {string[]} */
    address

    /**
     * @param {string} address
     */
    constructor(address) {
        const SEPARATED_MAC_ADDRESS = /^([0-9a-fA-F]{2}[^0-9a-fA-F]){5}[0-9a-fA-F]{2}$/
        const CONTINUOUS_MAC_ADDRESS = /^[0-9a-fA-F]{12}$/
        if (address.match(SEPARATED_MAC_ADDRESS)) {
            this.address = address.toLowerCase().split(/[^0-9a-f]/g)
        } else if (address.match(CONTINUOUS_MAC_ADDRESS)) {
            this.address = address.toLowerCase().split(/(?<=.{2})/g)
        } else {
            throw new Error(`Malformed MAC address: ${address}`)
        }
    }

    /**
     * @param {string} separator
     * @return {string}
     */
    separated = function (separator) {
        return this.address.join(separator)
    }

    /**
     * @return {string} The MAC address without any separator
     */
    continuous = function () {
        return this.separated('')
    }
}

module.exports = {
    Computer,
    MAC,
}
