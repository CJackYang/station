var ursa                = require('ursa');
var encoding            = require('encoding');

var serverModulusBit    = 512;
var serverMaxBit        = serverModulusBit/8;
var serverRealBit       = serverMaxBit - 11;
var padding             = ursa.RSA_PKCS1_PADDING;

//加密，使用服务端公钥加密
exports.serverEncrypt = function(plain){
    plain = plain || "";
    return encrypt(plain, serverPublic, serverRealBit, padding);
};

//解密，使用服务端私钥解密
exports.serverDecrypt = function(cipher){
    cipher = cipher || "";
    return decrypt(cipher, serverPrivate, serverMaxBit, padding);
};

//用于获取内容的字节数
function bytes(text, coding) {
    if (typeof text === 'undefined') {
        throw new Error("must have a arg.");
    }

    coding = coding || 'utf8';
    return Buffer.byteLength(text.toString(), coding);
}

function encrypt(plain, publicKey, realBit, padding){
    var start1 = 0;
    var end1   = realBit;
    var result1 = '';
    var originBuff = new Buffer(plain);
    var originByte = bytes(plain, 'utf8');
    while(start1 < originByte){
        var originTmp  = originBuff.slice(start1, end1);
        result1 += publicKey.encrypt(originTmp, 'binary', 'binary', padding);
        start1 += realBit;
        end1 += realBit;
    }

    var encrypted =  encoding.convert(result1, 'binary', 'base64');

    return encrypted.toString();
}

function decrypt(cipher, privateKey, maxBit, padding){
    var start2 = 0;
    var end2   = maxBit;
    var result2 = '';
    var cipherBuff = encoding.convert(cipher, 'base64', 'binary');   //这个地方很关键，直接使用new Buffer(cipher, 'base64') 报编码错误
    var cipherByte = bytes(cipher, 'base64');
    while(start2 < cipherByte){
        var cipherTmp  = cipherBuff.slice(start2, end2);    //请注意slice函数的用法
        result2 += privateKey.decrypt(cipherTmp, 'binary', 'binary', padding); //先保存成二进制，待完成解密后再转换成字符串
        start2 += maxBit;
        end2 += maxBit;
    }

    var decrypted =  encoding.convert(result2, 'binary', 'utf8');
    return decrypted.toString();
}