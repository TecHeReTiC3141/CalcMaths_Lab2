import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Scatter } from 'recharts';
import { Equation } from "../types.ts";
import { SEGMENTS } from "../constants.ts";
import { SystemSolutionFunction } from "../utils.ts";

type EquationGraphProps = {
  equation: Equation;
  a: number;
  b: number;
  ans: number;
}

export function  EquationGraph({ equation, a, b, ans }: EquationGraphProps) {
  if (!equation) return null
  const data = Array.from({ length: SEGMENTS }, (_, i) => {
    const x = a + (i / (SEGMENTS - 1)) * (b - a);
    return { x, y: equation(x) };
  });

  data.push({x: ans, dot: equation(ans), y: 0})

  data.sort((a, b) => a.x - b.x)

  return (
    <ComposedChart width={500} height={300} data={data}>
      <CartesianGrid />
      <XAxis dataKey="x" />
      <YAxis />
      <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
      <Scatter dataKey="dot" r={5} fill="red" />
      <Tooltip />
    </ComposedChart>
  );
}

type SystemGraphProps = ReturnType<SystemSolutionFunction>

export function SystemGraph({ ans, equations }: SystemGraphProps) {
  const SPACE = 10
  if (!ans || !equations) return null

  const leftBorderX = ans[0] - SPACE
  const rightBorderX = ans[0] + SPACE
  const leftBorderY = ans[1] - SPACE
  const rightBorderY = ans[1] + SPACE

  const equation1Data = Array.from({ length: SEGMENTS }, (_, i) => {
    const y = leftBorderY + (i / (SEGMENTS - 1)) * (rightBorderY - leftBorderY);
    return { x: equations[0](ans[0], y), y };
  });

  const equation2Data = Array.from({ length: SEGMENTS }, (_, i) => {
    const x = leftBorderX + (i / (SEGMENTS - 1)) * (rightBorderX - leftBorderX);
    return { x, y: equations[1](x, ans[1])};
  });

  console.log("DATA", equation1Data,  equation2Data)

  return (
    <ComposedChart width={500} height={300}>
      <CartesianGrid />
      <XAxis dataKey="x" />
      <YAxis dataKey="y" />
      <Line type="monotone" dataKey="x" stroke="#8884d8" data={equation1Data} dot={false} />
      <Line type="monotone" dataKey="y" stroke="green" data={equation2Data} dot={false} />
      <Scatter data={[{ x: ans[0], y: ans[1] }]} r={5} fill="red" />
      <Tooltip />
    </ComposedChart>
  );
}
