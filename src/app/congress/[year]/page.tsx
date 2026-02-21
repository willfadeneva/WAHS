import CongressClientWrapper from './CongressClientWrapper';

interface PageProps {
  params: {
    year: string;
  };
}

export default function CongressPage({ params }: PageProps) {
  const { year } = params;
  
  return <CongressClientWrapper year={year} />;
}