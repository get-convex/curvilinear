import {
  Component,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
} from "react";
import { AnchorHTMLAttributes } from "react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function fr<T = HTMLElement, P = React.HTMLAttributes<T>>(
  component: ForwardRefRenderFunction<T, P>,
) {
  const wrapped = forwardRef(component as any);
  wrapped.displayName = component.name;
  return wrapped;
}

function se<
  T = HTMLElement,
  P extends React.HTMLAttributes<T> = React.HTMLAttributes<T>,
>(Tag: keyof React.ReactHTML, ...classNames: ClassValue[]) {
  const component = fr<T, P>(({ className, ...props }, ref) => (
    // @ts-expect-error Too complicated for TypeScript
    <Tag ref={ref} className={cn(...classNames, className)} {...props} />
  ));
  component.displayName = Tag[0].toUpperCase() + Tag.slice(1);
  return component;
}

const Code: any = se<HTMLElement>(
  "code",
  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
);

const Link: any = se<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(
  "a",
  "font-medium text-primary underline underline-offset-4 hover:no-underline",
);

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: ReactNode | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    const errorText = "" + (error as any).toString();
    if (
      errorText.includes("@clerk/clerk-react") &&
      errorText.includes("publishableKey")
    ) {
      const [clerkDashboardUrl] = errorText.match(/https:\S+/) ?? [];
      return {
        error: (
          <>
            <p>
              Add{" "}
              <Code>
                VITE_CLERK_PUBLISHABLE_KEY="{"<"}your publishable key{">"}"
              </Code>{" "}
              to the <Code>.env.local</Code> file
            </p>
            {clerkDashboardUrl ? (
              <p>
                You can find it at{" "}
                <Link href={clerkDashboardUrl} target="_blank">
                  {clerkDashboardUrl}
                </Link>
              </p>
            ) : null}
            <p className="pl-8 text-muted-foreground">Raw error: {errorText}</p>
          </>
        ),
      };
    }

    return { error: <p>{errorText}</p> };
  }

  componentDidCatch() {}

  render() {
    if (this.state.error !== null) {
      return (
        <div className="bg-red-100 p-8 flex flex-col gap-4 container">
          <h1 className="text-xl font-bold">
            Caught an error while rendering:
          </h1>
          {this.state.error}
        </div>
      );
    }

    return this.props.children;
  }
}
