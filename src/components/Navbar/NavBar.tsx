import { NavLink } from "react-router-dom";
import "./navBar.css";

export interface NavItem {
    label: string;
    path: string;
}

interface NavbarProps {
    tabs: NavItem[];
}

function Navbar({ tabs }: NavbarProps) {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                {tabs.map((item, index) =>
                (<li key={index}>
                    <NavLink
                        to={item.path}
                        
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        {item.label} </NavLink>
                </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
