import React, {
  memo,
  RefObject,
  useCallback,
  useRef,
  type MouseEvent,
} from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

import CloseIconImg from "../assets/icons/close.svg";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { Transition } from "@headlessui/react";

interface Props {
  title?: string;
  isOpen: boolean;
  center?: boolean;
  className?: string;
  /* function called when modal is closed */
  onDismiss?: () => void;
  children?: React.ReactNode;
  size?: keyof typeof sizeClasses;
}
const sizeClasses = {
  large: `w-400`,
  normal: `w-140`,
};

function Modal({
  title,
  isOpen,
  center = true,
  size = `normal`,
  className,
  onDismiss,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const outerRef = useRef(null);

  const wrapperClasses = classnames(
    `fixed flex flex-col items-center inset-0 z-50`,
    {
      "justify-center": center,
    },
  );
  const modalClasses = classnames(
    `flex flex-col items-center overflow-hidden transform bg-white modal shadow-large-modal rounded-xl border-gray-200`,
    {
      "mt-20 mb-2 ": !center,
    },
    sizeClasses[size],
    className,
  );
  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!onDismiss) return;
    if (ref.current && !ref.current.contains(event.target as Element)) {
      onDismiss();
    }
  }, []);

  useLockBodyScroll();

  const modal = (
    <div ref={outerRef} onClick={handleClick}>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition easy-in duration-95"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className={wrapperClasses}
      >
        {/* XXX: Why don't the tailwind classes set above apply? */}
        <div
          ref={ref}
          className={modalClasses}
          style={{ width: "400px", border: "1px solid rgb(229, 231, 235)" }}
        >
          {title && (
            <div className="flex items-center justify-between w-full pl-8 pr-4 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-700">{title}</div>
              <div className="p-4" onClick={onDismiss}>
                <img
                  src={CloseIconImg}
                  alt="Close"
                  className="w-4 text-gray-500 hover:text-gray-700"
                />
              </div>
            </div>
          )}
          {children}
        </div>
      </Transition>
    </div>
  );

  return ReactDOM.createPortal(
    modal,
    document.getElementById(`root-modal`) as Element,
  );
}

export default memo(Modal);
