/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

const sender = nacl.box.keyPair();
const receiver = nacl.box.keyPair();

export default class Cipher {
  constructor() {

  }

  encryptionFunction(plainText) {
    // sender computes a one time shared key
    const senderSharedKey = nacl.box.before(receiver.publicKey, sender.secretKey);

    // sender also computes a one time code.
    const oneTimeCode = nacl.randomBytes(24);


    // Getting the cipher text
    const cipherText = nacl.box.after(
        util.decodeUTF8(plainText),
        oneTimeCode,
        senderSharedKey,
    );

    // message to be transited.
    const messageInTransit = {cipherText, oneTimeCode};

    return messageInTransit;
  }

  decryptionFunction(message) {
    // Getting Viktoria's shared key
    const receiverSharedKey = nacl.box.before(sender.publicKey, receiver.secretKey);

    // Get the decoded message
    const decodedMessage = nacl.box.open.after(message.cipherText, message.oneTimeCode, receiverSharedKey);

    // Get the human readable message
    return (util.encodeUTF8(decodedMessage));
  }
}


