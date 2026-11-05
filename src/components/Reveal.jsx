import { useReveal } from '../hooks/useReveal.js';

export default function Reveal({ children, className, as: Tag = 'div' }) {
  const ref = useReveal();
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
