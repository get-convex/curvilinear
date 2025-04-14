import classNames from "classnames";
import { PriorityIcons } from "../types/types";

interface Props {
  priority: string;
  className?: string;
}

export default function PriorityIcon({ priority, className }: Props) {
  const classes = classNames(`w-4 h-4`, className);
  const Icon = PriorityIcons[priority.toLowerCase()];
  return <img src={Icon} alt={priority} className={classes} />;
}
