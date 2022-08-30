import '../styles/login.css';

const Login = () => {

    const loginHandler = (): void => {
        const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
        const authParams = {
            client_id: 'twa54edpob784quljykf2a82yv5gxe',
            redirect_uri: `https://twitch-companion.vercel.app/auth`,
            response_type: 'token',
            scope: 'user:read:follows'
        }
        const params = new URLSearchParams(authParams);
        authUrl.search = params.toString();
        chrome.tabs.create({
            url: authUrl.toString()
        });
    }

    return (
        <div className='loginContainer'>
            <button onClick={loginHandler}>
                login with TWITCH.TV
            </button>
        </div>
    );
};

export default Login;