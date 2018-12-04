export const getVersion = () => {
	return process.env.REACT_APP_APLICATION_VERSION;
}

export const verifyVersion = async () => {

	const response = fetch('https://api.github.com/repos/Juuhz/Json-Generator/contents/.env')
					.then(res => res.json())

	return response;

}