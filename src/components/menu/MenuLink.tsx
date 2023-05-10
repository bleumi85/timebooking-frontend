import React from 'react';
import { NavLink } from 'react-router-dom';
import { IMenuItem } from './menuLinks';

const MenuLink: React.FC<IMenuItem> = ({ label, target }) => (
    <NavLink
        to={target}
        style={({ isActive }) => {
            return {
                display: 'block',
                fontWeight: isActive ? 'bold' : '',
            };
        }}
    >
        {label}
    </NavLink>
);

export default MenuLink;
