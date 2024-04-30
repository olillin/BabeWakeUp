const child_process = require('child_process')
const wol = require('wol')

export class Computer {
    /**
     * @param {string} mac_address The MAC address of this computer
     */
    constructor(mac_address) {
        try {
            wol.createMagicPacket(mac_address)
        } catch (e) {
            throw new Error('Malformed MAC address')
        }
        this.mac_address = mac_address
    }

    /**
     * Wake up the computer.
     * @param {(err, res) => void} callback
     * @return {Promise<Boolean>} if waking up computer was successful
     */
    wake = function (callback) {
        return new Promise((resolve, reject) => {
            // Send Wake on LAN package
            wol.wake(this.mac_address, null, (err, res) => {
                // End Promise
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    /**
     * Check if the computer is awake.
     * @return {Promise<boolean>}
     */
    isAwake = function () {
        return new Promise((resolve, reject) => {
            // Check if MAC exists in ARP
            child_process.exec('arp -a', (error, stdout, stderr) => {
                let compare = process.platform === 'win32'
                    ? this.mac_address.replaceAll(':', '-')
                    : this.mac_address
                resolve(stdout.includes(compare))
            })
        })
    }
}
