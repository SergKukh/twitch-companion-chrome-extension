import MenuItem from './MenuItem';
import '../styles/Menu.css';
import FollowIcon from './icons/FollowIcon';
import TopStreamsIcon from './icons/TopStreamsIcon';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { IUser } from '../models/IUser';
import { getUser } from '../utils/user';
import UserContextMenu from './UserContextMenu';

interface MenuProps {
    setIsAuth: Dispatch<SetStateAction<boolean>>,
    setPage: Dispatch<SetStateAction<string>>
}

const Menu: FC<MenuProps> = ({ setIsAuth, setPage }) => {
    const [user, setUser] = useState({} as IUser);
    const [isVisibleContextMenu, setIsVisibleContextMenu] = useState(false);

    const updateUserInfo = async () => {
        const user = await getUser();
        setUser(user);
    }

    useEffect(() => {
        updateUserInfo();
    }, []);

    const userClickHandler = () => {
        setIsVisibleContextMenu(prev => !prev);
    }

    const clickHandler = (page: string) => {
        setPage(page);
    }

    return (
        <div className='menuContainer'>
            <div className='menuContainer__user'>
                <img src={user.profileImage} onClick={userClickHandler} />
                {isVisibleContextMenu && <UserContextMenu setIsAuth={setIsAuth} />}
            </div>
            <MenuItem
                icon={<FollowIcon />}
                title='Followed streams'
                pageName='LiveStreams'
                clickHandler={clickHandler}
            />
            <MenuItem
                icon={<TopStreamsIcon />}
                title='Top streams'
                pageName='TopStreams'
                clickHandler={clickHandler}
            />
        </div>
    );
};

export default Menu;