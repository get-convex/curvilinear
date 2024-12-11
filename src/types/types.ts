import CancelIconImg from "../assets/icons/cancel.svg";
import BacklogIconImg from "../assets/icons/circle-dot.svg";
import TodoIconImg from "../assets/icons/circle.svg";
import DoneIconImg from "../assets/icons/done.svg";
import InProgressIconImg from "../assets/icons/half-circle.svg";
import HighPriorityIconImg from "../assets/icons/signal-strong.svg";
import LowPriorityIconImg from "../assets/icons/signal-weak.svg";
import MediumPriorityIconImg from "../assets/icons/signal-medium.svg";
import NoPriorityIconImg from "../assets/icons/dots.svg";
import UrgentPriorityIconImg from "../assets/icons/rounded-claim.svg";

export type Issue = {
  id: string;
  title: string;
  description: string;
  priority: (typeof Priority)[keyof typeof Priority];
  status: (typeof Status)[keyof typeof Status];
  modified: Date;
  created: Date;
  kanbanorder: string;
  username: string;
};

export type Comment = {
  id: string;
  body: string;
  username: string;
  issue_id: string;
  created_at: Date;
};

export const Priority = {
  NONE: `none`,
  URGENT: `urgent`,
  HIGH: `high`,
  LOW: `low`,
  MEDIUM: `medium`,
};

export const PriorityDisplay = {
  [Priority.NONE]: `None`,
  [Priority.URGENT]: `Urgent`,
  [Priority.HIGH]: `High`,
  [Priority.LOW]: `Low`,
  [Priority.MEDIUM]: `Medium`,
};

export const PriorityIcons = {
  [Priority.NONE]: NoPriorityIconImg,
  [Priority.URGENT]: UrgentPriorityIconImg,
  [Priority.HIGH]: HighPriorityIconImg,
  [Priority.MEDIUM]: MediumPriorityIconImg,
  [Priority.LOW]: LowPriorityIconImg,
};

export const PriorityOptions: [
  string,
  string,
  (typeof Priority)[keyof typeof Priority],
][] = [
  [PriorityIcons[Priority.NONE], Priority.NONE, `None`],
  [PriorityIcons[Priority.URGENT], Priority.URGENT, `Urgent`],
  [PriorityIcons[Priority.HIGH], Priority.HIGH, `High`],
  [PriorityIcons[Priority.MEDIUM], Priority.MEDIUM, `Medium`],
  [PriorityIcons[Priority.LOW], Priority.LOW, `Low`],
];

export const Status = {
  BACKLOG: `backlog`,
  TODO: `todo`,
  IN_PROGRESS: `in_progress`,
  DONE: `done`,
  CANCELED: `canceled`,
};

export const StatusDisplay = {
  [Status.BACKLOG]: `Backlog`,
  [Status.TODO]: `To Do`,
  [Status.IN_PROGRESS]: `In Progress`,
  [Status.DONE]: `Done`,
  [Status.CANCELED]: `Canceled`,
};

export const StatusIcons = {
  [Status.BACKLOG]: BacklogIconImg,
  [Status.TODO]: TodoIconImg,
  [Status.IN_PROGRESS]: InProgressIconImg,
  [Status.DONE]: DoneIconImg,
  [Status.CANCELED]: CancelIconImg,
};

export const StatusOptions: [
  string,
  (typeof Status)[keyof typeof Status],
  string,
][] = [
  [StatusIcons[Status.BACKLOG], Status.BACKLOG, StatusDisplay[Status.BACKLOG]],
  [StatusIcons[Status.TODO], Status.TODO, StatusDisplay[Status.TODO]],
  [
    StatusIcons[Status.IN_PROGRESS],
    Status.IN_PROGRESS,
    StatusDisplay[Status.IN_PROGRESS],
  ],
  [StatusIcons[Status.DONE], Status.DONE, StatusDisplay[Status.DONE]],
  [
    StatusIcons[Status.CANCELED],
    Status.CANCELED,
    StatusDisplay[Status.CANCELED],
  ],
];
