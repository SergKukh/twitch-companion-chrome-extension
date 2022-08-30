import { useEffect } from 'react';
import { useState } from 'react';
import { fetchUser } from '../api/twitch';
import { getAccessToken } from '../utils/headers';
import { getUser, setUser } from '../utils/user';
import LiveStreams from './LiveStreams';
import Login from './Login';
import Menu from './Menu';
import '../styles/icons.css';
import TopStreams from './TopStreams';

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [page, setPage] = useState('LiveStreams');

    useEffect(() => {
        auth();
    }, []);

    const auth = async () => {
        const user = await getUser();
        const access_token = await getAccessToken();
        if (user && user.userId && user.access_token === access_token) {
            setIsAuth(true);
        } else if (access_token) {
            let user = await fetchUser();
            if (user.userId) {
                user = await setUser(user);
                setIsAuth(true);
            }
        }
    }

    const getPage = () => {
        switch (page) {
            case 'LiveStreams':
                return <LiveStreams />;
                break;
            case 'TopStreams':
                return <TopStreams />
                break;
            default:
                return <LiveStreams />;
        }

    }

    return (
        <div className='appContainer'>
            {
                isAuth
                    ?
                    <>
                        <Menu setIsAuth={setIsAuth} setPage={setPage} />
                        {getPage()}
                    </>
                    :
                    <Login />
            }
        </div>
    );
};

export default App;