/**
 *  POST
 *  timer for build and push image
 *   
 *  Created by CPU on 20/8/19
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const line = require('@line/bot-sdk');

const buildImageWeek = require('./buildImageWeek');
const dataCollection = require("../models/dataModel");

router.post("/", (req, res, next) => {

    var data = {
        message: "hello"
    }

    // dataCollection.findOne(
    //     {
    //         line_id: req.body.line_id, 'counting.week_by_date': 37
    //     }
    //     )
    //     .exec()
    //     .then(docs => {
    //         res.json(docs)
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });


    dataCollection.findOne({ line_id: req.body.line_id })
        .exec()
        .then(docs => {
            // res.status(200).json(docs);
            console.log(docs.counting.length);

            var countingLength = docs.counting.length;

            if (countingLength != 0) {
                listCounting(docs.counting[countingLength - 1].week_by_date);
                console.log(docs.counting[countingLength - 1].week_by_date)
            }
            else {
                console.log('no array');
            }

            // list counting in array
            function listCounting(week) {
                if (docs.timer_status == 'timeout' && docs.counting[(docs.counting.length) - 1].status == 'close') {
                    var list = [];
                    for (var i = 0 ; i < countingLength ; i++) {
                        var arr = docs.counting[i];
                        if (arr.week_by_date == week) {
                            if (arr.count_type == 'CTT') {
                                var row = {
                                    date: arr.date.toLocaleDateString(),
                                    count_amount: arr.ctt_amount,
                                    result: arr.result
                                }
                            }
                            else {
                                var row = {
                                    date: arr.date.toLocaleDateString(),
                                    count_amount: arr.sdk_first_meal + ' / ' + arr.sdk_second_meal + ' / ' + arr.sdk_third_meal,
                                    result: arr.result
                                }
                            }
                            list.push(row);
                        }
                    }
                    res.status(200).json(list);   
                }
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });



});

module.exports = router;





// setTimeout(function () {
    //     console.log('time out yeah!!!!')

    //     buildImageWeek.buildImage(data);
    // }, 3000);  // don't forget to change ms to 518400000 ms 

// if (countingLength % 7 == 0) {
            //     if (docs.timer_status == 'timeout') {
            //         var list = [];
            //         for (var i = countingLength - 7 ; i < countingLength ; i++) {
            //             var row = docs.counting[i];
            //             if (row.count_type == 'CTT') {

            //             }
            //             else {

            //             }
            //         }
            //     }
            // }


//var ImageBuilder = require('./imageBuilder');
// ImageBuilder.build(slip);
// var timestamp = Number(new Date());
//     var slip = {
//         _id: timestamp,
//         cash: input.cash,
//         change: input.change,
//         date_time: input.date_time,
//         items_data: items,
//         pos_no: input.pos_no,
//         store: {
//             branch: input.store.branch,
//             name: input.store.name,
//             reg_id: input.store.reg_id,
//             tax_id: input.store.tax_id,
//             tele: input.store.tele
//         },
//         total_item: input.total_item,
//         total_price: input.total_price
//     }