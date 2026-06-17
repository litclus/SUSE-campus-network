import axios from "axios"
import { isNotEmpty } from "litils/guard"
import GetEncryptedPassword from "./EncryptPassword.js"
import dotenv from "dotenv"

dotenv.config({ path: [ ".env", ".env.local"], override: true })
const axiosInstance = axios.create({ timeout: 10000 })

async function connect() {
	try {
		if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.SERVICE)
			throw new Error("请打开.env文件配置账号和密码以及运营商！")

		const response = await axiosInstance.get("http://www.baidu.com")
		
		if(response.data?.match(/baidu/i)) {
			throw new Error("已连接网络或者已通过其它方式连接校园网！")
		}
		
		const location = response.data.match(/top.self.location.href=['"](.*)['"]/)?.[1] ?? ""
		if (!location) {
			throw new Error("重定向地址获取失败！")
		}

		const ParseURL = new URL(location)

		const pageInfoUrl = new URL("/eportal/InterFace.do?method=pageInfo", ParseURL.origin).href
		const loginUrl = new URL("/eportal/InterFace.do?method=login", ParseURL.origin).href

		const data =
			(
				await axiosInstance.post(pageInfoUrl, `queryString=${ParseURL.search.replace("?", "")}`, {
					headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: location, Origin: ParseURL.origin },
				})
			)?.data ?? {}

		const publicKeyExponent = data.publicKeyExponent
		const publicKeyModulus = data.publicKeyModulus

		if (!isNotEmpty(data) || !publicKeyExponent || !publicKeyModulus) {
			throw new Error("公钥模数或公钥指数获取失败！")
		}

		const encryptedPassword = GetEncryptedPassword(process.env.PASSWORD, publicKeyModulus, publicKeyExponent)
		if (!isNotEmpty(encryptedPassword)) {
			throw new Error("密码加密失败！")
		}

		const loginResponse = await axiosInstance.post(
			loginUrl,
			`userId=${process.env.USERNAME}&password=${encryptedPassword}&service=${encodeURIComponent(process.env.SERVICE)}&queryString=${encodeURIComponent(new URLSearchParams(ParseURL.searchParams).toString())}&operatorPwd=&operatorUserId=&validcode=&passwordEncrypt=true`,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					Referer: location,
					Origin: ParseURL.origin,
				},
			},
		)

		{
			const data = loginResponse.data
			if (data.result == "success") {
				console.log(`校园网（${process.env.SERVICE}）连接成功！`)
				return true
			} else {
				throw new Error(`校园网（${process.env.SERVICE}）连接失败:`, data.message)
			}
		}
	} catch (error) {
		console.log(error.message)
		return false
	}
}

export default connect