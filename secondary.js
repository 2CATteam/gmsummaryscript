const https = require('https');

const token = require('./token.json').token;

function getChats(page) {
	https.get(`https://api.groupme.com/v3/groups?token=${token}&page=${page}`, (res) => {
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
			for (i in chats.response) {
				console.log(`${chats.response[i].name}: ${chats.response[i].id}`)
				size++
			}
			if (size >= 10) {
				getChats(page+1)
			}
		})
	}).on('error', (e) => {
		console.error(e)
	})
}

getChats(1)