import type { FC } from 'react';
import { createPortal } from 'react-dom';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Component for adding JSON-LD structured data to a page
 * @param data - The structured data object to be rendered as JSON-LD
 */
const JsonLd: FC<JsonLdProps> = ({ data }) => {
  return createPortal(
    <script type="application/ld+json">{JSON.stringify(data)}</script>,
    document.head
  );
};

export default JsonLd; 