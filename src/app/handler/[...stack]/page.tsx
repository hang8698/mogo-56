import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";
import { ThemeInitializer } from "./ThemeInitializer";

export default function Handler(props: unknown) {
  return (
    <>
      <ThemeInitializer />
      <StackHandler fullPage app={stackServerApp} routeProps={props} />
    </>
  );
}
