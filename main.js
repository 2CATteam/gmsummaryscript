const https = require('https');

const token = require('./token.json').token;
const group_id = require('./id.json').id;

var msgNums = {}

function getMessages(last) {
	let url = `https://api.groupme.com/v3/groups/${group_id}/messages?token=${token}&before_id=${last}&limit=100`
	if (last == null) {
		url = `https://api.groupme.com/v3/groups/${group_id}/messages?token=${token}&limit=100`
	}
	https.get(url, (res) => {
		let chunks = []
		res.on('data', (d) => {
			chunks.push(d)
		})
		res.on('end', (d) => {
			let str = ""
			for (i in chunks) {
				str = str.concat(chunks[i])
			}
			let chats = JSON.parse(str)
			let size = 0
			let newLast = 0;
			for (i in chats.response.messages) {
				//console.log(chats.response[i])
				size++
				newLast = chats.response.messages[i].id
				if (msgNums[chats.response.messages[i].sender_id] == undefined) {
					msgNums[chats.response.messages[i].sender_id] = { num: 0, likes: 0, liked: 0 }
				}
				msgNums[chats.response.messages[i].sender_id].num++
				msgNums[chats.response.messages[i].sender_id].likes += chats.response.messages[i].favorited_by.length
				for (j in chats.response.messages[i].favorited_by) {
					if (msgNums[chats.response.messages[i].favorited_by[j]] == undefined) {
						msgNums[chats.response.messages[i].favorited_by[j]] = { num: 0, likes: 0, liked: 0 }
					}
					msgNums[chats.response.messages[i].favorited_by[j]].liked++
				}
			}
			if (size >= 100) {
				getMessages(newLast)
			}
			else {
				addInNames().then( (r) => {
					console.log("Name, messages, likes, liked")
					for (i in msgNums) {
						console.log(`${msgNums[i].currName}, ${msgNums[i].num}, ${msgNums[i].likes}, ${msgNums[i].liked}`)
					}
				}).catch((err) => { console.error(err) })
			}
		})
	}).on('error', (e) => {
		console.error(e)
	})
}

function addInNames() {
	var toReturn = new Promise( (resolve, reject) => {
		https.get(`https://api.groupme.com/v3/groups/${group_id}?token=${token}`, (res) => {
			let chunks = []
			res.on('data', (d) => {
				chunks.push(d)
			})
			res.on('end', (d) => {
				let str = ""
				for (i in chunks) {
					str = str.concat(chunks[i])
				}
				let chats = JSON.parse(str)
				for (i in chats.response.members) {
					if (msgNums[chats.response.members[i].user_id] == undefined) {
						msgNums[chats.response.members[i].user_id] = {num: 0, likes: 0, liked: 0}
					}
					msgNums[chats.response.members[i].user_id].currName = chats.response.members[i].nickname
				}
				resolve(null)
			})
		}).on('error', (e) => {
			console.error(e)
			rej(e)
		})
	})
	return toReturn
}

getMessages(null)