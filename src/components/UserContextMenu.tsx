import { Dispatch, FC, SetStateAction } from 'react';
import '../styles/UserContextMenu.css';
import { logout } from '../utils/user';
import LogoutIcon from './icons/LogoutIcon';

interface UserContextMenuProps {
    setIsAuth: Dispatch<SetStateAction<boolean>>
}

const UserContextMenu: FC<UserContextMenuProps> = ({ setIsAuth }) => {

    const logoutHandler = async () => {
        await logout();
        setIsAuth(false);
    }

    return (
        <div className="userContextContainer">
            <div className="userContextContainer__btn" onClick={logoutHandler}>
                <LogoutIcon />
                <span>Log Out</span>
            </div>
        </div>
    );
};

export default UserContextMenu;