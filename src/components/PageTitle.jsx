import { Helmet } from 'react-helmet';

export default function PageTitle({ title, description }) {
  const fullTitle = title ? `${title} | Capstone Project Management` : 'Capstone Project Management';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}