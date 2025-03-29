import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Scatter, ScatterChart } from 'recharts';
import { Equation } from "../types.ts";
import { SEGMENTS } from "../constants.ts";
import { SystemSolutionFunction } from "../utils.ts";
import { memo, ReactNode } from "react";

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

const SPACE = 5

const generateCurveData = (equation: (x: number, y: number) => number, xRange: number[]) => {
  const data = [];
  for (const x of xRange) {
    for (let y = -SPACE; y <= SPACE; y += SPACE / SEGMENTS) {
      if (Math.abs(equation(x, y)) < 0.075) { // ищем точки, удовлетворяющие уравнению
        data.push({ x, y, r: 1 });
      }
    }
  }
  return data;
};

const xRange = Array.from({ length: SEGMENTS }, (_, i) => -SPACE + i * 2 * SPACE / SEGMENTS)

export const SystemGraph = memo(function SystemGraph({ ans, equations }: SystemGraphProps) {
  if (!ans || !equations) return null
  const curve1 = generateCurveData(equations[0], xRange);
  const curve2 = generateCurveData(equations[1], xRange);

  return (
      <ScatterChart width={600} height={400}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="X" />
        <YAxis type="number" dataKey="y" name="Y" />
        <Tooltip  />

        {/* Первая кривая */}
        <Scatter name="Equation 1" data={curve1} fill="blue" />

        {/* Вторая кривая */}
        <Scatter name="Equation 2" data={curve2} fill="red" />

        {/* Точка пересечения */}
        <Scatter name="Intersection" data={[ { x: ans[ 0 ], y: ans[ 1 ] }]} fill="green" shape="star" />
      </ScatterChart>
  ) as ReactNode;
})
