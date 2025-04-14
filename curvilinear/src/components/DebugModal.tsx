import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onDismiss?: () => void;
}

export default function DebugModal({ isOpen, onDismiss }: Props) {
  return (
    <Modal title="Debug View" isOpen={isOpen} onDismiss={onDismiss}>
      <div className="flex flex-col w-full px-8 py-5 overflow-y-auto prose prose-sm">
        <p className="my-1">
          This is an example of a team collaboration app such as{` `}
          <a href="https://linear.app" target="_blank">
            Linear
          </a>
          {` `}
          built using{` `}
          <a href="http://www.convex.dev" target="_blank">
            Convex
          </a>
          {` `}.
        </p>
        <p className="my-1">
          This example is built on top of ElectricSQL's fork of the excellent
          clone of the Linear UI built by{` `}
          <a href="https://github.com/tuan3w" target="_blank">
            Tuan Nguyen
          </a>
          .
        </p>
        <p className="my-1">
          We have replaced the canned data with a stack running{` `}
          <a href="https://github.com/get-convex/convex" target="_blank">
            Convex
          </a>
          .
        </p>
      </div>
    </Modal>
  );
}
