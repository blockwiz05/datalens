import GradualSpacing from "../lib/HeaderUtil";

export function GradualSpacingDemo() {
  return (
    <GradualSpacing
      className="font-display text-center text-6xl font-bold tracking-[-0.1em] text-black dark:text-white md:leading-[5rem]"
      text={<div className="tracking-wide">Welcome to <span style={{color:"#15C1E1"}}>SSV DataLens</span>!</div>}
    />
  );
}
