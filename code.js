const axios = require('axios')


// const host = 'https://melody-app.fpingtest.link'
const host = process.argv[2]
console.log(host)



async function ping() {
    const res = await axios.get(host + '/api/ping');
    console.log(`1. ping api /api/ping ==> ${res.status} | ${JSON.stringify(res.data)}`);
    return res !== null && res.data.value === 'pong';
}
// ping()

async function getActivityInfo(token, area) {
    // {
//     onAct: {
//       id: '1748527867893791719',
//       sgs: {
//         currency: 'SGS',
//         quote: '10000000000000000000',
//         format: '10',
//         decimal: 18
//       },
//       userCount: 1,
//       signUpStart: '1667520000000',
//       signUpEnd: '1667577600000',
//       checkInStart: '1667599200000',
//       checkInEnd: '1667606400000',
//       isSignIn: false,
//       isCheckIn: false,
//       isClaim: false
//     }
//   }
    try {
        const res = await axios.get(host + '/api/act/check/info', {
            headers: {Token: token},
            params: { area }
        })
        console.log(`2. get activity info ==> /api/act/check/info ${res.status} | ${JSON.stringify(res.data)}`)
        return res.data;
    }catch(error) {
        console.error(`2. get activity info ==> /api/act/check/info error ${error.response.status} | ${JSON.stringify(error.response.data)}`)
        return { onAct: { id: null } }
    }
}
// getActivityInfo(token, 'asia')


// 打卡接口
async function checkin(token, actId) {
    let res;
    try {
        res = await axios.post(host + '/api/act/check/check/in', { actAreaId: actId }, {
            headers: {Token: token}
        })
        // console.log(res.data)
        console.log(`3. checkin /api/act/check/check/in ==> ${res.status} | ${JSON.stringify(res.data)}`)
        return true;
    }catch(error) {
        console.log(`3. checkin /api/act/check/check/in error ==> ${error.response.status} | ${JSON.stringify(error.response.data)}`)
        return false;
    }
} 
// checkin(token, '1748527867893791719')


async function scheduleForCheckIn(token, area) {
    let next = true;
    next = await ping();
    if (!next) {
        return;
    }
    let {onAct: { id: actId }} = await getActivityInfo(token, area)
    next = !!actId
    if (!next) {
        return;
    }
    // // mock start
    // actId = '1748527867893791719'
    // console.log('actId', actId)
    // // mock end
    next = await checkin(token, actId)
    if (!next) {
        return
    }
    console.log('checkin success')
}

module.exports = {
    scheduleForCheckIn
}