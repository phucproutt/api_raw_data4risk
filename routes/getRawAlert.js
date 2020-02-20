const _ = require("lodash")
const express = require("express")
const router = express.Router()
const modelAlert = require("../models/alerts")
const { mapAlertAggregatedToRaw, findCollectionFromType, valueForAlert } = require("../services/services")

router.get("/getRawAlert", async function(req, res) {

  const postalCode = req.params.postal_code || req.query.postal_code
  const typeAlert = req.params.type_alert || req.query.type_alert
  const startAlert = req.params.expected_at || req.query.expected_at
  const endAlert = req.params.estimated_end || req.query.estimated_end
  const country = req.params.country || req.query.country || 'FRANCE'

  if (!!postalCode && !!typeAlert && !!startAlert && !!endAlert) {
    const typeRaw = mapAlertAggregatedToRaw(typeAlert)
    const values = valueForAlert(typeAlert) 
    const collectionName = findCollectionFromType(typeAlert, country)
    if (typeRaw !== "" && collectionName !== "") {
      //aggregator to get raw alert
      var groupObject = {
        _id: {
          timestamp: "$expected_time"
        },
        level: {
          $max: "$level"
        },
        count: { $sum: 1 }
      }
      values.map((ele) => {
        const keyMax = `max_${ele}`
        const keyMin = `min_${ele}`
        const keyAvg = `avg_${ele}`
        groupObject[keyMax] = {
          $max: `$value.${ele}`
        }
        groupObject[keyMin] = {
          $min: `$value.${ele}`
        }
        groupObject[keyAvg] = {
          $avg: `$value.${ele}`
        }
      })      
      modelAlert[collectionName].aggregate(
        [
          { 
            $match: {
              expected_time: {
                $gte: new Date(startAlert), 
                $lte: new Date(endAlert)
              },
              code_postal: postalCode,
              country: country,
              type: {
                $in: typeRaw
              }
            }
          },
          {
            $group: groupObject
          },
          {
            $sort: {
              "_id.timestamp": 1
            }
          }
        ]).allowDiskUse(true)
        .exec((err, result) => {
          if (err) {
            res.status(400).send('Error serveur')
            throw err
          }
          var dataFinal = []
          var keys = values.length !== 0 ? values : ['level']
          keys.map(val => {
            var obj = {}
            const keyMax = `max_${val}`
            const keyMin = `min_${val}`
            const keyAvg = `avg_${val}`
            var keyData = []
            result.map(ele => {
              var info = {
                max: ele[keyMax],
                min: ele[keyMin],
                avg: ele[keyAvg],
                level: ele.level,
                date: ele._id.timestamp
              }
              keyData.push(info)
            })
            obj["key"] = val
            obj["data"] = keyData
            dataFinal.push(obj)
            return obj
          })
          res.status(200).send(dataFinal)
        })
    } else {
      res.status(400).send("The type of alert is unknown")
    }
  } else {
    res.status(400).send("Not enough parameters")
  }
})

module.exports = router;
