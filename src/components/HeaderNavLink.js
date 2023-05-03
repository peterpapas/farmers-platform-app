import React from "react";
import { NavLink } from "react-router-dom";

function HeaderNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      activeclassname="text-gray-800"
    >
      {children}
    </NavLink>
  );
}

export default HeaderNavLink;
