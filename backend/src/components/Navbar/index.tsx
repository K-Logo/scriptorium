import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { UserContext } from "../../contexts/user";

export default function Navbar() {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [userMobileDropdownOpen, setUserMobileDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = window.localStorage.getItem('user');
        const user = JSON.parse(userJson);
        if (user && user.jwtToken) {
          setUser(user);
        }
      }, []);
    

    function handleLogout() {
        toggleUserDropdown();
        window.localStorage.removeItem('user');
        window.location.reload();
    }

    function handleMobileLogout() {
        toggleMobileUserDropdown();
        window.localStorage.removeItem('user');
        window.location.reload();
    }

    function toggleHamburger() {
        setHamburgerOpen(!hamburgerOpen);
        setUserMobileDropdownOpen(false);
    }

    function HamburgerDropdown() {
        return hamburgerOpen && (
            <ul id="nav-links-sm">
                <Link href="/run" onClick={() => toggleHamburger()}><li>Run</li></Link>
                <Link href="/code-templates" onClick={() => toggleHamburger()}><li>Code Templates</li></Link>
                <Link href="/blogs" onClick={() => toggleHamburger()}><li>Blogs</li></Link>
            </ul> 
        );
    }

    function toggleUserDropdown() {
        setUserDropdownOpen(!userDropdownOpen);
    }

    function UserDropdown() {
        if (user && user.id !== undefined && user.role === "USER") {
            return userDropdownOpen && (
                <ul id="user-dropdown">
                    <li>Welcome, {user.username}!</li>
                    <Link href="/edit-profile" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">View & edit profile</li></Link>
                    <Link href="/manage-code-templates" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Manage code templates</li></Link>
                    <Link href="" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Manage blog posts</li></Link>
                    <Link href="" onClick={() => handleLogout()}><li className="user-dropdown-item">Log out</li></Link>
                </ul>
            )
        } else if (user && user.id !== undefined && user.role === "ADMIN") {
            return userDropdownOpen && (
                <ul id="user-dropdown">
                    <li>Welcome, {user.username}!</li>
                    <Link href="/admin-dash" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Admin Dashboard</li></Link>
                    <Link href="/edit-profile" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">View & edit profile</li></Link>
                    <Link href="/manage-code-templates" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Manage code templates</li></Link>
                    <Link href="" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Manage blog posts</li></Link>
                    <Link href="" onClick={() => handleLogout()}><li className="user-dropdown-item">Log out</li></Link>
                </ul>
            )
        } else {
            return userDropdownOpen && (
                <ul id="user-dropdown">
                    <li>Please log in.</li>
                    <Link href="/login" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Login</li></Link>
                    <Link href="/signup" onClick={() => toggleUserDropdown()}><li className="user-dropdown-item">Sign up</li></Link>
                </ul>
            )
        }
        
    }

    function UserIcon() {
        let profilePicturePath;
        if (user && user.id) {
            profilePicturePath = "http://" + user.avatarPath;
        } else {
            profilePicturePath = "http://localhost:3000/avatars/loggedout.png";
        }
        return (
            <button className="icon" id="user-icon" onClick={() => toggleUserDropdown()}><img src={profilePicturePath} alt="User Icon"></img></button>
        )
    }

    function MobileUserDropdown() {
        if (user && user.id !== undefined && user.role === "USER") {
            return userMobileDropdownOpen && (
                <ul id="user-mobile-dropdown">
                    <li>Welcome, {user.username}!</li>
                    <Link href="/edit-profile" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">View & edit profile</li></Link>
                    <Link href="" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Manage code templates</li></Link>
                    <Link href="" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Manage blog posts</li></Link>
                    <Link href="" onClick={() => handleMobileLogout()}><li className="user-dropdown-item">Log out</li></Link>
                </ul>
            )
        } else if (user && user.id !== undefined && user.role === "ADMIN") {
            return userMobileDropdownOpen && (
                <ul id="user-mobile-dropdown">
                    <li>Welcome, {user.username}!</li>
                    <Link href="/admin-dash" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Admin Dashboard</li></Link>
                    <Link href="/edit-profile" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">View & edit profile</li></Link>
                    <Link href="" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Manage code templates</li></Link>
                    <Link href="" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Manage blog posts</li></Link>
                    <Link href="" onClick={() => handleMobileLogout()}><li className="user-dropdown-item">Log out</li></Link>
                </ul>
            )
        } else {
            return userMobileDropdownOpen && (
                <ul id="user-mobile-dropdown">
                    <li>Please log in.</li>
                    <Link href="/login" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Login</li></Link>
                    <Link href="/signup" onClick={() => toggleMobileUserDropdown()}><li className="user-dropdown-item">Sign up</li></Link>
                </ul>
            )
        }
        
    }

    function toggleMobileUserDropdown() {
        setHamburgerOpen(false);
        setUserMobileDropdownOpen(!userMobileDropdownOpen);
    }

    function MobileUserIcon() {
        let profilePicturePath;
        if (user && user.id) {
            profilePicturePath = "http://" + user.avatarPath;
        } else {
            profilePicturePath = "http://localhost:3000/avatars/loggedout.png";
        }

        if (userMobileDropdownOpen) {
            profilePicturePath = "http://localhost:3000/graphics/x.png";
        }
        return (
            <button className="icon" id="mobile-user-icon" onClick={() => toggleMobileUserDropdown()}><img src={profilePicturePath} alt="User Icon"></img></button>
        )
    }

    function HamburgerIcon() {
        let picturePath = "http://localhost:3000/graphics/hamburger.png";
        if (hamburgerOpen) {
            picturePath = "http://localhost:3000/graphics/x.png";
        }
        return (
            <button className = "icon" id="hamburger-menu" onClick={() => toggleHamburger()}><img src={picturePath} alt="Hamburger"></img></button>
        );
    }

    return (
        <>
            <header id="header">
                <Link href="/"><img className="icon" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/handouts/pp1/logo.jpg" alt="Icon"></img></Link>
                <div id="mobile-icons">
                    <HamburgerIcon/>
                    <MobileUserIcon/>
                </div>
                <ul id="nav-links">
                    <Link href="/run"><li>Run</li></Link>
                    <Link href="/code-templates"><li>Code Templates</li></Link>
                    <Link href="/blogs"><li>Blogs</li></Link>
                    <li><UserIcon/></li>
                </ul>
            </header>
            <UserDropdown/>
            <HamburgerDropdown/>
            <MobileUserDropdown/>
        </>
    )
}