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

    const u_name = username;
    const ref_token = refreshtoken;

    const generate_session_id = await generateSessionKey().then(result);

    let get_user_id;
    let user_id;
    const fetch_condition = [u_name];

    try {
      const get_sql = 'select id from users where userid=?';

      get_user_id = await DbOperation.execCustomQuery(get_sql, fetch_condition);

      user_id = get_user_id[0].id;
    } catch (error) {
      //  console.log(error);
      result = {success: false, msg: error};
      return result;
    }

    let currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let flag_insert_success = 0;

    const fieldsData = [
      'session_id',
      'user_id',
      'login_time',
      'token',
    ];
    const valuesData = [
      [
        generate_session_id,
        user_id,
        currentdate,
        ref_token,
      ],
    ];


    try {
      await DbOperation.insertData('sessions', fieldsData, valuesData);
      flag_insert_success = 1;
      result = {success: true, msg: 'session inserted'};
    } catch (error) {
      result = {success: false, msg: 'session insertion failed'};
    }

    let get_max_id;
    let get_max_id_from_session;
    let returned_max_user_id;

    const fetch_condition1 = [user_id];

    try {
      get_max_id = 'select max(id) as maxid from sessions where user_id = ?';
      get_max_id_from_session = await DbOperation.execCustomQuery(get_max_id, fetch_condition1);
      returned_max_user_id = get_max_id_from_session[0].maxid;
    } catch (error) {
      console.log(error);
    }

    const updateData =
        {
          'logout_time': currentdate,
        };

    const condData =
        {
          'user_id': user_id,
          'id': returned_max_user_id-1,
        };


    if (flag_insert_success == 1) {
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
    let get_session_data;
    const fetch_condition2= [];

    const query = `
    select session_id, token from sessions where id = (select max(id) from sessions) and logout_time is null;`;

    try {
      get_session_data = await DbOperation.execCustomQuery(query, fetch_condition2);
      result = {success: true, msg: 'query passed', output: get_session_data};
    } catch (error) {
      result = {success: false, msg: 'query failed', output: get_session_data};
    }
    return result;
  }
}
