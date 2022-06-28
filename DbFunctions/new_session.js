/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import crypto from 'crypto';
import DbOperation from 'db_pkg';

const generateSessionKey = async function() {
  return crypto.randomBytes(8).toString('base64');
};

export default class SessionClass {
  constructor() {

  }

  async insertSession(username, refreshtoken) {
    let result;

    const uName = username;
    const refToken = refreshtoken;

    const generateSessionId = await generateSessionKey().then(result);

    let getUserId;
    let userId;
    const fetchCondition = [uName];

    try {
      const getSql = 'select id from users where userid=?';

      getUserId = await DbOperation.execCustomQuery(getSql, fetchCondition);

      userId = getUserId[0].id;
    } catch (error) {
      //  console.log(error);
      result = {success: false, msg: error};
      return result;
    }

    const currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let flagInsertSuccess = 0;

    const fieldsData = [
      'session_id',
      'user_id',
      'login_time',
      'token',
    ];
    const valuesData = [
      [
        generateSessionId,
        userId,
        currentdate,
        refToken,
      ],
    ];


    try {
      await DbOperation.insertData('sessions', fieldsData, valuesData);
      flagInsertSuccess = 1;
      result = {success: true, msg: 'session inserted'};
    } catch (error) {
      result = {success: false, msg: 'session insertion failed'};
    }

    let getMaxId;
    let getMaxIdFromSession;
    let returnedMaxUserId;

    const fetchCondition1 = [userId];

    try {
      getMaxId = 'select max(id) as maxid from sessions where user_id = ?';
      getMaxIdFromSession = await DbOperation.execCustomQuery(getMaxId, fetchCondition1);
      returnedMaxUserId = getMaxIdFromSession[0].maxid;
    } catch (error) {
      console.log(error);
    }

    const updateData =
        {
          'logout_time': currentdate,
        };

    const condData =
        {
          'user_id': userId,
          'id': returnedMaxUserId-1,
        };


    if (flagInsertSuccess == 1) {
      try {
        await DbOperation.updateData('sessions', updateData, condData);
        result = {
          success: true,
          message: 'previous session ended.',
        };
      } catch (error) {
        console.log('updating error'+error);
        result = {
          success: false,
          message: 'previous session update failed.',
        };
      }
    }
    return result;
  }


  async fetchSessiondata(username) {
    let result;
    let getSessionData;
    const fetchCondition2= [];

    const query = `
    select session_id, token from sessions where id = (select max(id) from sessions) and logout_time is null;`;

    try {
      getSessionData = await DbOperation.execCustomQuery(query, fetchCondition2);
      result = {success: true, msg: 'query passed', output: getSessionData};
    } catch (error) {
      result = {success: false, msg: 'query failed', output: getSessionData};
    }
    return result;
  }
}
