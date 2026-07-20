import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 20, className, ...rest }: IconProps) => {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ?? Icons.Circle;
  return <Cmp size={size} className={className} {...rest} />;
};
