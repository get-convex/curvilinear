import HelpIconImg from "../assets/icons/help.svg";
import MenuIconImg from "../assets/icons/menu.svg";
import ConvexIconImg from "../assets/images/convex.svg";
import BacklogIconImg from "../assets/icons/circle-dot.svg";
import { MenuContext } from "../App";
import classnames from "classnames";
import { memo, RefObject, useRef, useState, useContext } from "react";
import { BsPencilSquare as AddIcon } from "react-icons/bs";
import { BsSearch as SearchIcon } from "react-icons/bs";
import { BsCollectionFill as IssuesIcon } from "react-icons/bs";
import { MdKeyboardArrowDown as ExpandMore } from "react-icons/md";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import AboutModal from "./AboutModal";
import IssueModal from "./IssueModal";
import ItemGroup from "./ItemGroup";
import ProfileMenu from "./ProfileMenu";
import DebugModal from "./DebugModal";
import { useCachedUser } from "@/hooks/useUser";

function LeftMenu() {
  const user = useCachedUser();
  const ref = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDebugView, setShowDebugView] = useState(false);
  const { showMenu, setShowMenu } = useContext(MenuContext)!;

  const classes = classnames(
    `absolute z-40 lg:static inset-0 transform duration-300 lg:relative lg:translate-x-0 bg-white flex flex-col flex-shrink-0 w-56 font-sans text-sm text-gray-700 border-r border-gray-100 lg:shadow-none justify-items-start`,
    {
      "-translate-x-full ease-out shadow-none": !showMenu,
      "translate-x-0 ease-in shadow-xl": showMenu,
    },
  );

  return (
    <>
      <div className={classes} ref={ref}>
        <button
          className="flex-shrink-0 px-5 ml-2 lg:hidden h-14"
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            src={MenuIconImg}
            alt="Menu"
            className="w-3.5 text-gray-500 hover:text-gray-800"
          />
        </button>

        {/* Top menu*/}
        <div className="flex flex-col flex-grow-0 flex-shrink-0 px-5 py-3">
          <div className="flex items-center justify-between">
            {/* Project selection */}
            <Link
              className="flex items-center p-2 pr-3 rounded cursor-pointer hover:bg-gray-100"
              to="/"
            >
              <span className="flex text-sm font-medium">CurviLinear</span>
            </Link>

            {/* User avatar  */}
            <div className="relative">
              <button
                className="flex items-center justify-center p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar
                  name={user?.fullName || "CX"}
                  avatarUrl={user?.imageUrl}
                  // XXX: Online indicator.
                  online={true}
                  showOffline={true}
                />
                <ExpandMore size={13} className="ml-2" />
              </button>
              <ProfileMenu
                isOpen={showProfileMenu}
                onDismiss={() => setShowProfileMenu(false)}
                setShowAboutModal={setShowAboutModal}
                setShowDebugView={setShowDebugView}
                className="absolute top-10"
              />
            </div>
          </div>

          {/* Create issue btn */}
          <div className="flex">
            <button
              className="inline-flex w-full items-center px-2 py-2 mt-3 bg-white border border-gray-300 rounded hover:bg-gray-100 h-7"
              onClick={() => {
                setShowIssueModal(true);
              }}
            >
              <AddIcon className="mr-2.5 w-3.5 h-3.5" /> New Issue
            </button>
            <Link
              to="/search"
              className="inline-flex ms-2 items-center px-2 py-2 mt-3 bg-white border border-gray-300 rounded hover:bg-gray-100 h-7"
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col flex-shrink flex-grow overflow-y-auto mb-0.5 px-2">
          <ItemGroup title="Your Issues">
            <Link
              to="/"
              className="flex items-center pl-6 rounded cursor-pointer group h-7 hover:bg-gray-100"
            >
              <IssuesIcon className="w-3.5 h-3.5 mr-2" />
              <span>All Issues</span>
            </Link>
            <Link
              to="/?status=todo,in_progress"
              className="flex items-center pl-6 rounded cursor-pointer h-7 hover:bg-gray-100"
            >
              <span className="w-3.5 h-6 mr-2 inline-block">
                <span className="block w-2 h-full border-r"></span>
              </span>
              <span>Active</span>
            </Link>
            <Link
              to="/?status=backlog"
              className="flex items-center pl-6 rounded cursor-pointer h-7 hover:bg-gray-100"
            >
              <img
                src={BacklogIconImg}
                alt="Backlog"
                className="w-3.5 h-3.5 mr-2"
              />
              <span>Backlog</span>
            </Link>
          </ItemGroup>

          {/* extra space */}
          <div className="flex flex-col flex-grow flex-shrink" />

          {/* bottom group */}
          <div className="flex flex-col px-2 pb-2 text-gray-500 mt-7">
            <a className="inline-flex" href="https://convex.dev/">
              <img
                src={ConvexIconImg}
                alt="Convex"
                className="w-3 h-3 mr-2 mt-1 scale-150"
              />
              {` `}
              Convex
            </a>
            <button
              className="inline-flex mt-1"
              onClick={() => setShowAboutModal(true)}
            >
              <img src={HelpIconImg} alt="Help" className="w-3 mr-2 mt-1" />{" "}
              About
            </button>
          </div>
        </div>
      </div>
      {/* Modals */}
      {
        <AboutModal
          isOpen={showAboutModal}
          onDismiss={() => setShowAboutModal(false)}
        />
      }
      {
        <IssueModal
          isOpen={showIssueModal}
          onDismiss={() => setShowIssueModal(false)}
        />
      }
      {
        <DebugModal
          isOpen={showDebugView}
          onDismiss={() => setShowDebugView(false)}
        />
      }
    </>
  );
}

export default memo(LeftMenu);
