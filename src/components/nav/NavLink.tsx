import React from 'react';
import { NavLink } from 'react-router-dom';
import { CustomNavLinkProps } from './navLinks';

const CustomNavLink: React.FC<CustomNavLinkProps> = ({ label, target }) => (
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

export default CustomNavLink;
