/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import DbOperation from 'db_pkg';
import UserCrud from '../DbFunctions/userCrudFunctions.js';


export async function logout(req, response) { // logout
  const username = req.body.username;
  let result;

  const userCrudFunctions = new UserCrud();
  const userData = await userCrudFunctions.getUserDataByParameterDB('(userid=?)', [username]);
  const userId = userData.values[0].id;
  // const currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const jsTime = new Date();
  const currentdate = jsTime.toISOString().split('T')[0] + ' ' + jsTime.toTimeString().split(' ')[0];


  let getMaxId;
  let getMaxIdFromSession;
  let returnedMaxUserId;

  const fetchCondition = [userId];

  try {
    getMaxId = 'select max(id) as maxid from sessions where user_id = ?';
    getMaxIdFromSession = await DbOperation.execCustomQuery(getMaxId, fetchCondition);
    returnedMaxUserId = getMaxIdFromSession[0].maxid;
  } catch (error) {
    console.log('error in fetching max id'+error);
  }

  const updateData =
        {
          'logout_time': currentdate,
        };

  const condData =
        {
          'user_id': userId,
          'id': returnedMaxUserId,
        };


  try {
    await DbOperation.updateData('sessions', updateData, condData);
    result = {
      success: true,
      message: 'session ended successfully.',
    };
  } catch (error) {
    console.log(error);
    result = {
      success: false,
      message: 'session update failed.',
    };
  }

  response.status(200).json(result);
}
