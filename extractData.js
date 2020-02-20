const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const JSON5 = require('json5')
function mapDollarDate(object) {
  _.forEach(object, (value, key) => {
    if (typeof value === 'object') {
      if (value.hasOwnProperty('$date'))
        object[key] = new Date(value['$date'])
      else
        mapDollarDate(value)
    }
  })
}
function parse(jsonArray) {
  return jsonArray.map((entry_str) => {
    let entry = JSON5.parse(entry_str)
    mapDollarDate(entry)
    return entry
  })
}
const url = 'mongodb://localhost:27017/test'
function getFile(db) {
  return new Promise((ok, ko)=> {
      let leftover = ''
      let pass = true // DEBUG
      const fileStream = fs.createReadStream('/Users/hc.phuc/Desktop/alertes_brutes_submersion.json')
      fileStream.on('data', buffer => {
        const data = buffer.toString()
        const objStrs = (leftover + data).match(/"\{.*?\}"/g)
        const leftoverIdx = data.lastIndexOf('"{')
        if (leftoverIdx === -1) {
          leftover = ''
        } else {
          leftover = data.slice(leftoverIdx)
        }
        // if (pass) {
        //   // console.log(objStrs)
        //   // console.log('\n---------------------\n')
        //   // console.log(leftover)
          const entries = parse(objStrs.map(str => JSON5.parse(str)))
          // console.log(_.take(entries, 6))
          db.collection('submersion').insertMany(entries)
        // }
        // pass = false
       
      })
      fileStream.on('end', () => { ok() })
      fileStream.on('error', (err) => { ko(err) })
  })
}
async function main() {
  const client = new MongoClient(url, { useNewUrlParser: true })
  await client.connect()
  const db = client.db('test')
  await getFile(db)
  //const file = JSON.parse(content)
    //console.log(file.length)
}
main().catch(console.log)