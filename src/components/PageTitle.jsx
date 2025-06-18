import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTitle({ title, description }) {
  const [pageTitle, setPageTitle] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const fullTitle = title ? `${title} | Management Capstone` : 'Management Capstone';
    setPageTitle(fullTitle);
    
    // You can also use document.title directly as a backup
    document.title = fullTitle;
  }, [title, location.pathname]);
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}