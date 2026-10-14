import type { ILoginRequest } from "./IAuth";


export const HandleLogin = async (loginRequest: ILoginRequest) => {
    const response = await fetch('https://localhost:7140/api/Authentication/authenticate',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        }
    );
    if(!response.ok){
        throw new Error('Login failed');
    }

    const token = (await response.text()).trim();

    if (!token) {
        throw new Error('La API devolvió un token vacío.');
    }

    return { token };
}