import { Helmet } from 'react-helmet-async';
import type { FC } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Component for adding JSON-LD structured data to a page
 * @param data - The structured data object to be rendered as JSON-LD
 */
const JsonLd: FC<JsonLdProps> = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default JsonLd; 