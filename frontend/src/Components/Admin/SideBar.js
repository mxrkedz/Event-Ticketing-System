import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="/dashboard">
              <i className="fa fa-tachometer"></i> Dashboard
            </Link>
          </li>

          <li>
            <a
              href="#eventSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-event-hunt"></i> Events
            </a>
            <ul className="collapse list-unstyled" id="eventSubmenu">
              <li>
                <Link to="/admin/events">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/event">
                  <i className="fa fa-plus"></i> Create
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="#postSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-post-hunt"></i> Posts
            </a>
            <ul className="collapse list-unstyled" id="postSubmenu">
              <li>
                <Link to="/admin/posts">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/post">
                  <i className="fa fa-plus"></i> Create
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/admin/orders">
              <i className="fa fa-shopping-basket"></i> Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              <i className="fa fa-users"></i> Users
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
