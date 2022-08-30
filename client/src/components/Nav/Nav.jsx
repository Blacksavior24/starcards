import React, { useState } from "react";
import logo from "../../img/logoLanding.png";
import { NavLink } from "react-router-dom";
import UserOptions from "./UserOptions/UserOptions";
import ChatNotifications from "./ChatNotifications/ChatNotifications";

import css from "./Nav.module.css";
import useValidToken from "../../hooks/useValidToken";
import { useSelector } from "react-redux";

export default function Nav() {
  const user = useSelector((state) => state.userReducer);
  const { validToken } = useValidToken({ navigate: false });
  const [visibleUserOptions, setVisibleUserOptions] = useState(false);
  const userActive = useSelector((state) => state.userReducer.user);

  const handleVisibleUserOptions = () => {
    setVisibleUserOptions(!visibleUserOptions);
  };

  function navEnabled() {
    return (
      <div>
        <NavLink className={css.link} to="/">
          <img className={css.img} src={logo} alt="Logo de StarCards" />
        </NavLink>
      </div>
    );
  }

  function navDisabled() {
    return (
      <div>
        <NavLink className={css.link} to="/userProfile">
          <img className={css.img} src={logo} alt="Logo de StarCards" />
        </NavLink>{" "}
      </div>
    );
  }

  return (
    <div className={css.nav}>
      {!userActive ? navEnabled() : navDisabled()}

      <ul className={css.ul}>
        <li className={css.li}>
          <NavLink className={css.link} to="/shop">
            <span className={css.span}>STORE</span>
          </NavLink>
        </li>
        {validToken && (
          <>
            <li className={`${css.li} ${css.liMedium}`}>
              <NavLink className={css.link} to="/playroom">
                <span className={css.span}>PLAYROOM</span>
              </NavLink>
            </li>
          </>
        )}
        <li className={`${css.li} ${css.liMedium}`}>
          <NavLink className={css.link} to="/game">
            <span className={css.span}>GAME</span>
          </NavLink>
        </li>
        <li className={css.li}>
          <NavLink className={css.link} to="/about">
            <span className={css.span}>ABOUT</span>
          </NavLink>
        </li>
      </ul>

      <button
        id="link-perfil"
        className={css.btn}
        onClick={handleVisibleUserOptions}
      >
        {user.user.id ? (
          <img
            id="btnMenu"
            className={css.profile}
            src={user.user.profileImg}
            alt="image profile"
          />
        ) : (
          // <span id="btnMenu" className="material-symbols-outlined">
          //   account_circle
          // </span>
          <img src="../../../css/perfil_Mesa_de_trabajo.png" id="btnMenu" alt="Perfil" />
        )}
      </button>

      {visibleUserOptions && (
        <div className={css.userOptions}>
          <UserOptions handleVisibleUserOptions={handleVisibleUserOptions} />
        </div>
      )}
    </div>
  );
}
