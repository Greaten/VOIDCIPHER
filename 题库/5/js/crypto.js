/**
 * 鲨鲨wiki - 加密工具模块
 * Base64 + XOR 双重加密（UTF-8字节级）
 * 与 Python 端兼容：str.encode('utf-8') -> byte XOR -> Base64
 */
var SharkCrypto = (function() {
    'use strict';

    var DEFAULT_KEY = "SHARK_DEEP_2024";

    /**
     * UTF-8 字节级 XOR 加密
     * @param {string} plaintext - 明文
     * @param {string} key - 密钥
     * @returns {string} Base64 编码的密文
     */
    function encrypt(plaintext, key) {
        key = key || DEFAULT_KEY;
        var textBytes = new TextEncoder().encode(plaintext);
        var keyBytes = new TextEncoder().encode(key);
        var encrypted = new Uint8Array(textBytes.length);

        for (var i = 0; i < textBytes.length; i++) {
            encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
        }

        // 转为 Base64
        var binary = '';
        for (var j = 0; j < encrypted.length; j++) {
            binary += String.fromCharCode(encrypted[j]);
        }
        return btoa(binary);
    }

    /**
     * UTF-8 字节级 XOR 解密
     * @param {string} ciphertext - Base64 编码的密文
     * @param {string} key - 密钥
     * @returns {string} 明文
     */
    function decrypt(ciphertext, key) {
        key = key || DEFAULT_KEY;
        var binary = atob(ciphertext);
        var encryptedBytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            encryptedBytes[i] = binary.charCodeAt(i);
        }

        var keyBytes = new TextEncoder().encode(key);
        var decrypted = new Uint8Array(encryptedBytes.length);

        for (var j = 0; j < encryptedBytes.length; j++) {
            decrypted[j] = encryptedBytes[j] ^ keyBytes[j % keyBytes.length];
        }

        return new TextDecoder('utf-8').decode(decrypted);
    }

    /**
     * 验证密码（解密后比对）
     * @param {string} input - 用户输入
     * @param {string} encryptedAnswer - Base64加密的答案
     * @param {string} key - 密钥
     * @returns {boolean}
     */
    function verify(input, encryptedAnswer, key) {
        try {
            var answer = decrypt(encryptedAnswer, key);
            return input.trim() === answer.trim();
        } catch(e) {
            return false;
        }
    }

    return {
        encrypt: encrypt,
        decrypt: decrypt,
        verify: verify
    };
})();
