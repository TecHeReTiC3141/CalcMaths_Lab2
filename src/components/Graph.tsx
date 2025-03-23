import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';
import { Equation } from "../types.ts";
import { SEGMENTS } from "../constants.ts";

type GraphProps = {
  equation: Equation;
  a: number;
  b: number;
  root: number;
};


export function  FunctionGraph({ equation, a, b, root }: GraphProps) {
  const data = Array.from({ length: SEGMENTS }, (_, i) => {
    const x = a + (i / (SEGMENTS - 1)) * (b - a);
    return { x, y: equation(x) };
  });

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid />
      <XAxis dataKey="x" domain={[a - 1, b + 1]} />
      <YAxis />
      <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
      <ReferenceDot x={root} y={equation(root)} r={20} fill="red" stroke="none" />
      <Tooltip />
    </LineChart>
  );
}

export default FunctionGraph;
