import { FC, ReactNode } from 'react';
import '../styles/MenuItem.css';

interface MenuItemProps {
    icon: ReactNode,
    title: string,
    pageName: string,
    clickHandler: (page: string) => void;
}

const MenuItem: FC<MenuItemProps> = ({ icon, title, pageName, clickHandler }) => {
    return (
        <div className='menuItemContainer' onClick={() => clickHandler(pageName)}>
            {icon}
        </div>
    );
};

export default MenuItem;