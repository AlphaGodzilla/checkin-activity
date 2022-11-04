const { scheduleForCheckIn } = require('./code')

// const token = '5c38941a0a1b462596cc63108fc0b345'
const token = process.argv[3]
// console.log('token', token)

// asia check in
scheduleForCheckIn(token, 'asia')