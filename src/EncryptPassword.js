import RSAUtils from "./security.js"

function GetEncryptedPassword(password, modulus, exponent) {
	// 反转字符串（按照 JS 中的逻辑）
	const reversed = password.split("").reverse().join("")

	RSAUtils.setMaxDigits(400)
	// 生成 RSA 密钥对（只用公钥）
	const key = RSAUtils.getKeyPair(exponent, "", modulus)

	// 加密（内部会自动处理分块、填充，并返回十六进制字符串）
	const encryptedPassword = RSAUtils.encryptedString(key, reversed)

	// 输出结果（去掉空格，全部小写，与你最初的 hex 对比）
	return encryptedPassword
}

export default GetEncryptedPassword
