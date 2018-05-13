var express = require('express');
var userRepository = require('../repository-module/data-accesors/user-accesor');
var dataValidator = require('../util-module/data-validators');
var router = express.Router();
// //
// router.post('/checkEmail', async (req, res) => {
//     let returnBody = {};
//     // if (dataValidator.notNullCheck(req) && dataValidator.objectHasPropertyCheck(req, 'body') && dataValidator.objectHasPropertyCheck(req.body, 'emailId')) {
//         const user = await userRepository.checkUserEmail(req.body);
//         if (dataValidator.objectHasPropertyCheck(user, 'rows') && dataValidator.arrayNotEmptyCheck(user.rows)) {
//             returnBody = {
//                 status: 200,
//                 FriendlyMessage: 'User Exists'
//             }
//         } else {
//             returnBody = {
//                 status: 701,
//                 FriendlyMessage: 'User email not Found.Please request your admin to add'
//             }
//         }
//     // } else {
//     //     returnBody = {
//     //         status:900,
//     //         FriendlyMessage:'Request does not contain any email Id'
//     //     }
//     // }
//     res.send(returnBody);
// });
module.exports = router;