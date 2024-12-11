import { MouseEventHandler } from "react";
import classnames from "classnames";
import AvatarImg from "../assets/icons/avatar.svg";

interface Props {
  online?: boolean;
  showOffline?: boolean;
  name?: string;
  avatarUrl?: string;
  onClick?: MouseEventHandler | undefined;
}

//bg-blue-500

function stringToHslColor(str: string, s: number, l: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(` + h + `, ` + s + `%, ` + l + `%)`;
}

function getAcronym(name: string) {
  let acr = ((name || ``).match(/\b(\w)/g) || [])
    .join(``)
    .slice(0, 2)
    .toUpperCase();
  if (acr.length === 1) {
    acr = acr + name.slice(1, 2).toLowerCase();
  }
  return acr;
}
function Avatar({ online, showOffline, name, onClick, avatarUrl }: Props) {
  let avatar, status;

  // create avatar image icon
  if (avatarUrl)
    avatar = (
      <img
        src={avatarUrl}
        alt={name}
        className="w-4.5 h-4.5 rounded-full"
        style={{ width: "20px", height: "20px" }}
      />
    );
  else if (name !== undefined) {
    // use name as avatar
    avatar = (
      <div
        className="flex items-center justify-center w-5 h-5 text-[10px] font-medium text-white rounded-full p-[6px]"
        style={{ backgroundColor: stringToHslColor(name, 65, 55) }}
      >
        {getAcronym(name)}
      </div>
    );
  } else {
    // try to use default avatar
    avatar = (
      <img src={AvatarImg} alt="avatar" className="w-4.5 h-4.5 rounded-full" />
    );
  }

  //status icon
  if (online || showOffline)
    status = (
      // <span className="absolute -right-0.5 -bottom-0.5 w-2 h-2 rounded-full bg-green-500 border border-white"></span>
      <span
        className={classnames(
          `absolute -right-0.5 -bottom-0.5 w-2 h-2 rounded-full border border-white`,
          {
            "bg-green-500": online,
            "bg-red-500": !online,
          },
        )}
      ></span>
    );
  else status = null;

  return (
    <div className="relative" onClick={onClick}>
      {avatar}
      {status}
    </div>
  );
}

export default Avatar;
