import NumberTicker from "../lib/Count";

const NumberTickerDemo = ({value}:any) => {
  return (
    <p className="whitespace-pre-wrap text-xl font-medium tracking-tighter text-black dark:text-white">
      <NumberTicker value={value} />
    </p>
  );
};

export default NumberTickerDemo;
